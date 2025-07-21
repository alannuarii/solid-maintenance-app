import { createSignal } from "solid-js";
import { engines } from "~/lib/data/engineData";

export default function InputRealisasiPM() {
  const [waktu, setWaktu] = createSignal("");
  const [unit, setUnit] = createSignal("");
  const [pm, setPm] = createSignal("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!waktu() || !unit() || !pm()) {
      console.log("Error: Semua field harus diisi");
      return;
    }

    // Format waktu agar sesuai dengan datetime MySQL
    const waktuFormatted = `${waktu()} 00:00:00`;

    // Buat FormData dan append nilai
    const formData = new FormData();
    formData.append("waktu", waktuFormatted);
    formData.append("unit", unit());
    formData.append("pm", pm());

    try {
      const res = await fetch("/api/realisasi/pm", {
        method: "POST",
        body: formData, // browser akan otomatis set Content-Type multipart/form-data
      });

      const result = await res.json();

      if (res.ok) {
        console.log("Data berhasil disimpan, ID:", result.insertId);
        // Reset input agar form kosong setelah submit berhasil
        setWaktu("");
        setUnit("");
        setPm("");
      } else {
        console.log("Error:", result.error);
      }
    } catch (err) {
      console.log("Error:", err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} class="inputRealisasiPM">
      <div class="card p-md-5 p-3 mx-3 mx-md-0">
        <div class="mb-3">
          <label for="waktu" class="form-label">Waktu Realisasi</label>
          <input
            type="date"
            id="waktu"
            class="form-control"
            value={waktu()}
            onInput={(e) => setWaktu(e.currentTarget.value)}
          />
        </div>
        <div class="mb-3">
          <label for="unit" class="form-label">Unit</label>
          <select
            id="unit"
            class="form-select"
            value={unit()}
            onChange={(e) => setUnit(e.currentTarget.value)}
          >
            <option value="">Pilih Unit</option>
            {engines().map(({ mesin, unit }) => (
              <option value={unit} key={unit}>
                {mesin} Unit {unit}
              </option>
            ))}
          </select>
        </div>
        <div class="mb-3">
          <label for="pm" class="form-label">Jenis PM</label>
          <select
            id="pm"
            class="form-select"
            value={pm()}
            onChange={(e) => setPm(e.currentTarget.value)}
          >
            <option value="">Pilih Jenis PM</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
            <option value="P4">P4</option>
            <option value="P5">P5</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Simpan</button>
      </div>
    </form>
  );
}
