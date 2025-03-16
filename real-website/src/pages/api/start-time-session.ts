import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';

if (!import.meta.env.AIRTABLE_TOKEN || !import.meta.env.AIRTABLE_BASE) {
    throw new Error('Missing Airtable configuration');
}
const base = new Airtable({apiKey: import.meta.env.AIRTABLE_TOKEN}).base(import.meta.env.AIRTABLE_BASE);

import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if(request.method !== 'POST') {
        return new Response(null, { status: 405 });
    }
    try {
        const { token } = await request.json();

        const signupRecords = await base('Signups').select({
            filterByFormula: `{Token} = '${token}'`,
            maxRecords: 1
        }).firstPage();
      
        if (!signupRecords || signupRecords.length === 0) {
          return new Response(JSON.stringify("User not found."), {status: 400});
        }

        const signupRecord = signupRecords[0];
        const sessionId = uuidv4();
        const startTime = new Date().toISOString();

        await base('Sessions').create([
            {
              fields: {
                ID: sessionId,
                Signups: [signupRecord.id],
                startTime: startTime
              }
            }
        ]);

        return new Response(JSON.stringify({ sessionId, startTime }), {status: 200});
    } catch (error) {
        console.error('Error starting time session:', error);
        return new Response(JSON.stringify("Error starting time session."), {status: 500});
    }
};