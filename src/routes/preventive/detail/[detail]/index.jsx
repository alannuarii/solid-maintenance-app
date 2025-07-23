import { onCleanup, onMount, createSignal } from "solid-js";
import { convertDecimalDaysToDaysHours, convertTime } from "~/lib/utils/date";
import { gantiOliHours } from "~/lib/data/pmCycles";
import { fastMovingMaterials } from "~/lib/data/fastMoving";
import { toast, Toaster } from "solid-toast";
import "./index.css";

export default function PreventiveDetail() {
  const [selectedEvent, setSelectedEvent] = createSignal(null);
  const [copySuccess, setCopySuccess] = createSignal(false);

  onMount(() => {
    const storedEvent = localStorage.getItem("selectedEvent");
    if (storedEvent) {
      try {
        const parsed = JSON.parse(storedEvent);
        console.log("Data dari localStorage:", parsed);
        setSelectedEvent(parsed);
      } catch (e) {
        console.error("Error parsing selectedEvent:", e);
      }
    } else {
      console.log("selectedEvent tidak ada di localStorage");
      setSelectedEvent(null);
    }

    onCleanup(() => {
      localStorage.removeItem("selectedEvent");
    });
  });

  const detailData = () => {
    const event = selectedEvent();
    if (!event) return { engine: [], pm: [], material: [] };

    // Urutan siklus PM dari P1 sampai P5
    const cycleOrder = ["P1", "P2", "P3", "P4", "P5"];
    const pmIndex = cycleOrder.indexOf(event.pm);

    // Cari material sesuai unit
    const materialForUnit = fastMovingMaterials.find((item) => item.unit === event.unit);

    // Filter material berdasarkan siklus dari P1 sampai event.pm
    const allowedCycles = pmIndex !== -1 ? cycleOrder.slice(0, pmIndex + 1) : [];
    const filteredMaterials = materialForUnit ? materialForUnit.material.filter((m) => allowedCycles.includes(m.cycle)) : [];

    return {
      engine: [
        {
          label: "Mesin / Unit",
          data: event.mesin ?? "Tidak ada data",
        },
        {
          label: "Jam Operasi (Jam)",
          data: `${Math.floor(event.operasi)} / ${gantiOliHours((event.overhaul % 3000) % event.gantiOliCycles, event.unit)}` ?? "Tidak ada data",
        },
        {
          label: "Jam Ganti Oli (Jam)",
          data: `${Math.floor(event.gantiOli)} / ${event.gantiOliCycles}` ?? "Tidak ada data",
        },
        {
          label: "Jam Overhaul (Jam)",
          data: `${Math.floor(event.overhaul)} / ${event.overhaulCycles}` ?? "Tidak ada data",
        },
      ],
      pm: [
        { label: "Jenis PM", data: event.pm ?? "Tidak ada data" },
        { label: "Waktu Pelaksanaan", data: convertTime(event.tanggalPM, 3) },
        { label: "Waktu Tersisa", data: convertDecimalDaysToDaysHours(event.timeToGo) },
        { label: "Target Jam Operasi (Jam)", data: event.targetHours ?? "Tidak ada data" },
        { label: "Jam Operasi Saat Ini (Jam)", data: Math.floor(event.currentHours) ?? "Tidak ada data" },
      ],
      material: filteredMaterials.length > 0 ? filteredMaterials : [],
    };
  };

  function formatMesinUnit(mesinString) {
    if (!mesinString) return "Tidak ada data";
    // Cari pola "Unit <nomor>" di string
    const unitMatch = mesinString.match(/Unit\s+(\d+)/i);
    if (unitMatch && unitMatch[1]) {
      // Ambil angka unit
      const unitNumber = unitMatch[1];
      // Ambil nama mesin (before 'Unit')
      const mesinName = mesinString
        .split(/Unit\s+\d+/i)[0]
        .trim()
        .split(" ")[0];
      return `${mesinName} #${unitNumber}`;
    }
    // Jika pola tidak cocok, kembalikan string asli
    return mesinString;
  }

  const copyMessage = () => {
    const event = selectedEvent();
    if (!event) return;
    const formattedMesin = formatMesinUnit(event.mesin);
    const message = `Selamat malam, besok akan dilaksanakan pemeliharaan rutin ${event.pm} pada mesin ${formattedMesin}`;
    navigator.clipboard.writeText(message).then(() => {
      toast.success("Pesan berhasil disalin ke clipboard");
    });
  };

  return (
    <div class="detail">
      <div class="text-center mb-3">
        <h3 class="title">DETAIL DATA</h3>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3">
          <div class="card p-md-5 p-4 mx-3 mx-md-0">
            <div class="mb-2">
              <h5>Data Mesin</h5>
              {detailData().engine.map((item, idx) => (
                <div class="row mb-2" key={`engine-${idx}`}>
                  <label class="col-sm-5 col-form-label">{item.label}</label>
                  <div class="col-sm-7">
                    <input type="text" class="form-control" value={item.data} disabled />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h5>Data PM</h5>
              {detailData().pm.map((item, idx) => (
                <div class="row mb-2" key={`pm-${idx}`}>
                  <label class="col-sm-5 col-form-label">{item.label}</label>
                  <div class="col-sm-7">
                    <input type="text" class="form-control" value={item.data} disabled />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card p-md-5 p-4 mx-3 mx-md-0">
            <h5>Kebutuhan Material</h5>
            {detailData().material.length === 0 && <p>Material tidak tersedia untuk PM ini.</p>}
            {detailData().material.length > 0 && (
              <table class="table table-bordered">
                <thead class="text-center">
                  <tr>
                    <th>Nama Material</th>
                    <th>Jumlah</th>
                    <th>Satuan</th>
                  </tr>
                </thead>
                <tbody>
                  {detailData().material.map((mat, idx) => (
                    <tr key={`mat-${idx}`}>
                      <td>{mat.nama}</td>
                      <td class="text-center">{mat.jumlah}</td>
                      <td class="text-center">{mat.satuan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {selectedEvent() && (
        <div class="mt-4 mx-3 mx-md-0">
          <button class="btn btn-primary" onClick={copyMessage}>
            Copy Message
          </button>
        </div>
      )}
      <Toaster position="top-center" />
    </div>
  );
}
