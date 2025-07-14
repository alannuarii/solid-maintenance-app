import "./index.css";
import { engines } from "../../../public/data/engineData";
import { createSignal, createEffect, Show } from "solid-js";
import { generatePMSchedule } from "~/lib/utils/pmSchedule";
import { sumMaterialsAndPMByCycle } from "~/lib/utils/materialPM";

export default function Material() {
  const [waktuAwal, setWaktuAwal] = createSignal("");
  const [waktuAkhir, setWaktuAkhir] = createSignal("");
  const [selectedUnit, setSelectedUnit] = createSignal("");
  const [currentHours, setCurrentHours] = createSignal([]);
  const [materials, setMaterials] = createSignal({
    pm: { totalPM: 0, cycles: [] },
    totalMaterials: [],
  });
  const [error, setError] = createSignal(null);

  // Fetch currentHours saat selectedUnit berubah menggunakan async/await di createEffect
  createEffect(() => {
    const unit = selectedUnit();

    async function fetchCurrentHours() {
      if (!unit) {
        setCurrentHours([]); // reset jika unit kosong
        setError(null); // reset error ketika unit kosong
        return;
      }
      try {
        const response = await fetch(`/api/servicehour/${unit}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCurrentHours(data);
        setError(null); // reset error jika berhasil fetch
      } catch (err) {
        setError(`Gagal mengambil data service hour: ${err.message}`);
        setCurrentHours([]); // reset currentHours saat error
        console.error("Failed to fetch service hour data:", err);
      }
    }

    fetchCurrentHours();
  });

  // Hitung materials saat currentHours, waktuAwal, atau waktuAkhir berubah
  createEffect(() => {
    const hours = currentHours();
    const awal = waktuAwal();
    const akhir = waktuAkhir();
    if (hours.length && awal && akhir) {
      const schedule = generatePMSchedule(hours, awal, akhir);
      const sum = sumMaterialsAndPMByCycle(schedule);
      setMaterials(sum);
    } else {
      setMaterials({
        pm: { totalPM: 0, cycles: [] },
        totalMaterials: [],
      });
    }
  });

  return (
    <div>
      <div class="text-center mb-3">
        <h3 class="title">PERENCANAAN MATERIAL FAST MOVING</h3>
      </div>
      <div class="row gx-5">
        <div class="col-md-6 mb-4">
          <div class="card p-md-5 p-3 mx-3 mx-md-0">
            <div class="col-md-12">
              <div class="mb-3">
                <label for="waktuAwal" class="form-label fw-bold">
                  Waktu Awal
                </label>
                <input type="date" class="form-control" id="waktuAwal" value={waktuAwal()} onInput={(e) => setWaktuAwal(e.currentTarget.value)} />
              </div>
              <div class="mb-3">
                <label for="waktuAkhir" class="form-label fw-bold">
                  Waktu Akhir
                </label>
                <input type="date" class="form-control" id="waktuAkhir" value={waktuAkhir()} onInput={(e) => setWaktuAkhir(e.currentTarget.value)} />
              </div>
              <div class="mb-3">
                <label for="unitSelect" class="form-label fw-bold">
                  Mesin/Unit
                </label>
                <select class="form-select" id="unitSelect" aria-label="Default select example" value={selectedUnit()} onChange={(e) => setSelectedUnit(e.currentTarget.value)}>
                  <option selected disabled>Pilih unit . . .</option>
                  {engines().map(({ mesin, unit }) => (
                    <option value={unit} key={unit}>
                      {mesin} Unit {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="mx-3 mx-md-0">
            <Show when={!error()} fallback={<div class="alert alert-danger">Error: {error()}</div>}>
              <Show
                when={materials().pm && materials().pm.cycles && materials().totalMaterials && materials().totalMaterials.length > 0}
                fallback={
                  <div>
                    <img src="/public/img/waiting.png" class="img-fluid" alt="" />
                  </div>
                }
              >
                <div class="mb-4">
                  <div class="row mb-3">
                    <label for="inputEmail3" class="col-3 col-md-2 col-form-label fw-bold">
                      Total PM
                    </label>
                    <div class="col-2">
                      <input type="text" class="form-control text-center" id="inputEmail3" value={materials().pm.totalPM} disabled></input>
                    </div>
                  </div>

                  {materials().pm.cycles.map(({ cycle, total }) => (
                    <button class="btn btn-sm btn-secondary me-2" key={cycle} disabled>
                      {cycle} <span class="ms-md-3 badge text-bg-primary rounded-pill">{total}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <span class="badge text-bg-primary mb-2">Material Fast Moving</span>
                  {materials().totalMaterials.map(({ nama, jumlah, satuan }) => (
                    <div class="row mb-1" key={nama}>
                      <label for="inputEmail3" class="col-5 col-md-4 col-form-label">
                        {nama}
                      </label>
                      <div class="col-3">
                        <input type="text" class="form-control text-center" id="inputEmail3" value={jumlah} disabled></input>
                      </div>
                      <label for="inputEmail3" class="col-2 col-form-label">
                        {satuan}
                      </label>
                    </div>
                  ))}
                </div>
              </Show>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
