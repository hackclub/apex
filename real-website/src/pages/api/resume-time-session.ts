import Airtable from 'airtable';
import type { APIRoute } from 'astro';

if (!import.meta.env.AIRTABLE_TOKEN || !import.meta.env.AIRTABLE_BASE) {
    throw new Error('Missing Airtable configuration');
}
const base = new Airtable({apiKey: import.meta.env.AIRTABLE_TOKEN}).base(import.meta.env.AIRTABLE_BASE);

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { token, sessionId } = await request.json();
        
        const signupRecords = await base('Signups').select({
            filterByFormula: `{token} = '${token}'`,
            maxRecords: 1
        }).firstPage();

        if (!signupRecords || signupRecords.length === 0) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        const signupRecord = signupRecords[0];

        const records = await base('Sessions').select({
            filterByFormula: `{ID} = '${sessionId}'`,
            maxRecords: 1
        }).firstPage();

        if (!records || records.length === 0) {
            return new Response(JSON.stringify({ message: 'Time session not found' }), { status: 404 });
        }

        const previousPauseTime = records[0].fields.totalPauseTimeSeconds ?? 0;
        const pauseTimeStart = records[0].fields.pauseTimeStart;
        if (typeof pauseTimeStart !== 'string' && typeof pauseTimeStart !== 'number') {
            throw new Error('Invalid pauseTimeStart value');
        }
        const newPauseTime = Math.round(Number(previousPauseTime) + Math.abs(new Date().getTime() - new Date(pauseTimeStart).getTime()) / 1000);

        await base('Sessions').update([
            {
                id: records[0].id,
                fields: {
                    totalPauseTimeSeconds: newPauseTime,
                    pauseTimeStart: new Date().toISOString()
                }
            }
        ]);

        return new Response(JSON.stringify({ newPauseTime }), { status: 200 });
    } catch (error) {
        console.error('Error resuming Time session:', error);
        return new Response(JSON.stringify({ message: 'Error resuming time session' }), { status: 500 });
    }
};