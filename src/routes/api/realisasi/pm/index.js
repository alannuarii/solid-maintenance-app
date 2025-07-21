import { json } from "@solidjs/router";
import { poolMain } from "~/lib/db/mariadb";

export async function POST(event) {
    try {
        // Ambil formData dari request
        const formData = await event.request.formData();

        // Mengambil nilai form dari formData
        const waktu = formData.get("waktu");
        const unit = formData.get("unit");
        const pm = formData.get("pm");

        console.log({ waktu, unit, pm });

        // Validasi sederhana
        if (!waktu || !unit || !pm) {
            return json({ error: "Field waktu, unit, dan pm harus diisi" }, { status: 400 });
        }

        // Query insert ke MariaDB dengan prepared statement
        const sql = `INSERT INTO realisasi_pm (waktu, unit, pm) VALUES (?, ?, ?)`;
        const [result] = await poolMain.execute(sql, [waktu, parseInt(unit), pm]);

        // Response sukses
        return json({ message: "Data berhasil disimpan", insertId: result.insertId }, { status: 201 });

    } catch (error) {
        console.error("Error saat POST /api/realisasi/pm:", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
}
