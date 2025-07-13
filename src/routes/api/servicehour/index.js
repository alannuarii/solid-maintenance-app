import { poolMain } from "../../../lib/db/mariadb.js";

async function getServiceHour() {
    const query = `
        SELECT unit, jamoperasi FROM (
            SELECT unit, overhaul AS jamoperasi
            FROM preventive
            ORDER BY id DESC
            LIMIT 7
        ) AS subquery
        ORDER BY unit ASC;
    `;
    const values = [];

    try {
        const [rows] = await poolMain.query(query, values);
        return rows;
    } catch (err) {
        console.error('Database error:', err);
        return [];
    }
}


export async function GET() {
    const result = await getServiceHour();

    return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
    });
}
