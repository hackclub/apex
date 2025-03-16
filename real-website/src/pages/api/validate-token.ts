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
        console.log(token);

        const signupRecords = await base('Signups').select({
            filterByFormula: `{Token} = '${token}'`,
            maxRecords: 1
        }).firstPage();
      
        if (!signupRecords || signupRecords.length === 0) {
          return new Response(JSON.stringify("Invalid token."), {status: 400});
        }

        const signupRecord = signupRecords[0];

        return new Response(JSON.stringify("Valid token."), {status: 200});
    } catch (error) {
        console.error('Error validating token:', error);
        return new Response(JSON.stringify("Error validating token."), {status: 500});
    }
};