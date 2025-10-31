import { json } from "@solidjs/router";
import { poolMain } from "~/lib/db/mariadb";
import path from "path";
import fs from "fs/promises";

export async function GET(event) {
    const stockCode = event.params.detail
    try {
        // Contoh query ambil data dari MariaDB
        const [rows] = await poolMain.execute(`SELECT * FROM material WHERE stock_code = ${stockCode}`);

        // Kembalikan data dalam bentuk JSON
        return json(rows);
    } catch (error) {
        console.error("Error saat GET data", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(event) {
  const stockCode = event.params.detail;
  try {
    const formData = await event.request.formData();

    const alias = formData.get("alias");
    const engine = formData.get("engine");
    const engineUnit = formData.get("engine_unit");
    const location = formData.get("location");
    const remarks = formData.get("remarks");

    const photoFile = formData.get("photo");

    let pictureFileName = null;

    if (photoFile && photoFile.size > 0) {
      pictureFileName = `${stockCode}_material.jpg`;

      const dir = path.resolve("./public/img/materials");

      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
      }

      const buffer = await photoFile.arrayBuffer();
      await fs.writeFile(path.join(dir, pictureFileName), Buffer.from(buffer));
    }
    
    const sql = `
      UPDATE material
      SET alias = ?, engine = ?, engine_unit = ?, location = ?, remarks = ?, picture = ?
      WHERE stock_code = ?;
    `;

    // Jika tidak ada gambar, isi nama file dengan null atau empty string agar tetap update kolom picture di DB
    const pictureValue = pictureFileName || "";

    const params = [alias, engine, engineUnit, location, remarks, pictureValue, stockCode];

    const [result] = await poolMain.execute(sql, params);

    return json({ message: "Data berhasil disimpan", affectedRows: result.affectedRows }, { status: 200 });
  } catch (error) {
    console.error("Error saat POST /api/material/detail/:detail:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
}
