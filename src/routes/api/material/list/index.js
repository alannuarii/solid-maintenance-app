import { json } from "@solidjs/router";
import { poolMain } from "~/lib/db/mariadb";

export async function GET() {
    try {
        // Contoh query ambil data dari MariaDB
        const [rows] = await poolMain.execute("SELECT * FROM material ORDER BY material_id");

        // Kembalikan data dalam bentuk JSON
        return json(rows);
    } catch (error) {
        console.error("Error saat GET /api/realisasi/pm:", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
}