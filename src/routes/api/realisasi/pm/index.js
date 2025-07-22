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

        // Cek error duplikat unique constraint MariaDB error code 1062
        if (error && error.code === 'ER_DUP_ENTRY') {
            return json(
                { error: "Data dengan kombinasi waktu dan unit tersebut sudah ada. Tidak boleh duplikasi." },
                { status: 409 }
            );
        }

        return json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function GET(event) {
    try {
        // Contoh query ambil data dari MariaDB
        const [rows] = await poolMain.execute("SELECT * FROM realisasi_pm ORDER BY waktu DESC");

        // Kembalikan data dalam bentuk JSON
        return json(rows);
    } catch (error) {
        console.error("Error saat GET /api/realisasi/pm:", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
}
