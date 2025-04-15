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

        const timeRecords = await base('Cumulative').select({
            filterByFormula: `{Token} = '${token}'`,
            maxRecords: 1
        }).firstPage();
      
        if (!timeRecords || timeRecords.length === 0) {
          return new Response(JSON.stringify({ time:0 }), {status: 400});
        }

        const timeRecord = timeRecords[0]['fields']['Seconds'];

        return new Response(JSON.stringify({ time:timeRecord }), {status: 200});
    } catch (error) {
        console.error('Error retrieving time:', error);
        return new Response(JSON.stringify("Error retrieving time."), {status: 500});
    }
};