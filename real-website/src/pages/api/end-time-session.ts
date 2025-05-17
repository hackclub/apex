import Airtable from 'airtable';

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

        const { sessionId, description, vidLink } = await request.json();
        const records = await base('Sessions').select({
            filterByFormula: `{ID} = '${sessionId}'`,
            maxRecords: 1
          }).firstPage();
      
          if (!records || records.length === 0) {
            return new Response(JSON.stringify("Session not found."), {status: 400});
          }

        await base('Sessions').update([
            {
              id: records[0].id,
              fields: {
                "End Time": new Date().toISOString(),
                Moment: description,
                Video: vidLink
              }
            }
          ]);

        return new Response(JSON.stringify("Session ended!"), {status: 200});
    } catch (error) {
        console.error('Error stopping time session:', error);
        return new Response(JSON.stringify("Error stopping time session."), {status: 500});
    }
};