import { poolMain } from "../../../../lib/db/mariadb.js";

async function getServiceHour(unit) {
    const query = `
        SELECT unit, overhaul AS jamoperasi
        FROM preventive
        WHERE unit = ${unit}
        ORDER BY id DESC
        LIMIT 1
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


export async function GET({ params }) {
    const unit = params.unit;
    const result = await getServiceHour(unit);

    return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
    });
}
