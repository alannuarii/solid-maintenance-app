import { onMount, createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { engines } from "../lib/data/engineData";
import { generatePMSchedule } from "../lib/utils/pmSchedule";
import { convertTime } from "~/lib/utils/date";
import { gantiOliHours } from "~/lib/data/pmCycles";
import "./index.css";

export default function Home() {
  const [currentHours, setCurrentHours] = createSignal([]);

  onMount(async () => {
    try {
      const response = await fetch("/api/servicehour");
      const data = await response.json();
      const gantiOliCycles = [500, 250, 250, 500, 500, 250, 250];
      const overhaulCycles = [6000, 6000, 6000, 5000, 5000, 6000, 6000];
      const pmData = generatePMSchedule(data);

      const fullData = data.map(({ waktu, unit, ganti_oli, jamoperasi }, index) => {
        const engine = engines().find((e) => e.unit === unit);
        const pm = pmData.find((pm) => pm.extendedProps.unit === unit) || { title: "No PM Scheduled", id: "" };
        return {
          waktu,
          unit,
          gantiOli: ganti_oli,
          gantiOliCycles: gantiOliCycles[index],
          overhaul: jamoperasi,
          overhaulCycles: overhaulCycles[index],
          mesin: engine ? `${engine.mesin} Unit ${engine.unit}` : `Unit ${unit}`,
          pm,
        };
      });

      setCurrentHours(fullData);
      console.log("Current Hours Data:", currentHours());
    } catch (error) {
      console.error("Failed to fetch service hour data:", error);
    }
  });

  function savePmToLocalStorage(item) {
    if (item) {
      const eventData = {
        id: item.pm.id,
        mesin: item.mesin,
        unit: item.unit,
        pm: item.pm.title.split(" ")[0],
        gantiOli: item.gantiOli,
        gantiOliCycles: item.gantiOliCycles,
        overhaul: item.overhaul,
        overhaulCycles: item.overhaulCycles,
        operasi: (item.overhaul % 3000) % item.gantiOliCycles,
        tanggalPM: item.pm.start,
        timeToGo: item.pm.extendedProps.daysFromToday,
        targetHours: item.pm.extendedProps.targetHours,
        currentHours: item.pm.extendedProps.currentHours,
      };
      localStorage.setItem("selectedEvent", JSON.stringify(eventData));
      console.log("Data PM disimpan ke localStorage:", eventData);
    }
  }

  return (
    <div class="home">
      <h2 class="title mb-3 fw-bold">PLTD Tahuna Maintenance App</h2>
      <Show when={currentHours().length > 0} fallback={<div>Loading data...</div>}>
        <table class="table table-bordered text-center">
          <caption class="fst-italic">Data tanggal {currentHours().length > 0 ? convertTime(currentHours()[0].waktu, 1) : "Loading..."}</caption>

          <thead>
            <tr>
              <th scope="col" class="align-middle">
                Unit
              </th>
              <th scope="col">
                <div>Operasi</div>
                <div>(Jam)</div>
              </th>
              <th scope="col">
                <div>Ganti Oli</div>
                <div>(Jam)</div>
              </th>
              <th scope="col">
                <div>Overhaul</div>
                <div>(Jam)</div>
              </th>
              <th scope="col">
                <div>PM</div>
                <div>(P1-P5)</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentHours().map((item) => (
              <tr key={item.unit}>
                <td>{item.unit}</td>
                <td
                  class={
                    (item.overhaul % 3000) % item.gantiOliCycles > item.gantiOliCycles
                      ? "table-danger"
                      : (item.overhaul % 3000) % item.gantiOliCycles >= 0.9 * item.gantiOliCycles && item.gantiOliCycles === 250
                      ? "table-warning"
                      : (item.overhaul % 3000) % item.gantiOliCycles >= 0.95 * item.gantiOliCycles && item.gantiOliCycles === 500
                      ? "table-warning"
                      : ""
                  }
                >
                  {Math.floor((item.overhaul % 3000) % item.gantiOliCycles)} / <span class="fw-bold">{gantiOliHours((item.overhaul % 3000) % item.gantiOliCycles, item.unit)}</span>
                </td>
                <td
                  class={
                    item.gantiOli > item.gantiOliCycles
                      ? "table-danger"
                      : item.gantiOli >= 0.9 * item.gantiOliCycles && item.gantiOliCycles === 250
                      ? "table-warning"
                      : item.gantiOli >= 0.95 * item.gantiOliCycles && item.gantiOliCycles === 500
                      ? "table-warning"
                      : ""
                  }
                >
                  {Math.floor(item.gantiOli)} / <span class="fw-bold">{item.gantiOliCycles}</span>
                </td>
                <td class={item.overhaul > item.overhaulCycles ? "table-danger" : item.overhaul >= 0.75 * item.overhaulCycles ? "table-warning" : ""}>
                  {Math.floor(item.overhaul)} / <span class="fw-bold">{item.overhaulCycles}</span>
                </td>
                <td>
                  <A href={`/preventive/detail/${item.pm.id}`} onClick={() => savePmToLocalStorage(item)} class="btn" title="Simpan data PM ke localStorage dan buka detail">
                    {gantiOliHours((item.overhaul % 3000) % item.gantiOliCycles, item.unit) - Math.floor((item.overhaul % 3000) % item.gantiOliCycles)} / <span class="fw-bold">{item.pm.title.replace(/\s#\d+$/, "")}</span>
                  </A>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Show>
    </div>
  );
}
