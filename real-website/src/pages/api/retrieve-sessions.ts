import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';

if (!import.meta.env.AIRTABLE_TOKEN || !import.meta.env.AIRTABLE_BASE) {
    throw new Error('Missing Airtable configuration');
}
const base = new Airtable({ apiKey: import.meta.env.AIRTABLE_TOKEN }).base(import.meta.env.AIRTABLE_BASE);

import type { APIRoute } from 'astro';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (request.method !== 'POST') {
        return new Response(null, { status: 405 });
    }
    try {
        const { token } = await request.json();

        const signupRecords = await base('Signups').select({
            filterByFormula: `{Token} = '${token}'`,
            maxRecords: 1
        }).firstPage();

        if (!signupRecords || signupRecords.length === 0) {
            return new Response(JSON.stringify("User not found."), { status: 400 });
        }

        const sessionRecords = await base('Sessions').select({
            filterByFormula: `{Lookup} = '${token}'`,
            maxRecords: 1000,
            sort: [{ field: 'Start Time', direction: 'asc' }] // Sorting sessions by StartTime in ascending order
        }).firstPage();

        // Filter out sessions that have 'isCancelled' set to true
        const filteredSessionRecords = sessionRecords.filter(record => {
            return record.fields.isCancelled !== true && record.fields["End Time"] !== undefined;  // Exclude sessions where 'isCancelled' is true or 'endTime' is blank
        });

        // Trim the sessionRecords to only include the fields key (index -> fields)
        const trimmedSessionRecords = filteredSessionRecords.map(record => {
            return {
                ID: record.fields["ID"],
                startTime: record.fields["Start Time"],
                endTime: record.fields["End Time"],
                totalTime: record.fields["Total Time"],
                reviewedStatus: record.fields.reviewedStatus,
                moment: record.fields["Moment"],
                video: record.fields["Video"],
                notes: record.fields.rejectReason
            };
        });

        return new Response(JSON.stringify({ trimmedSessionRecords }), { status: 200 });
    } catch (error) {
        console.error('Error retrieving sessions:', error);
        return new Response(JSON.stringify("Error retrieving sessions."), { status: 500 });
    }
};
