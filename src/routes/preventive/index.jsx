import { onMount, onCleanup, createSignal } from "solid-js";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./index.css";
import { generatePMSchedule } from "../../lib/utils/pmSchedule";
import { engines } from "../../lib/data/engineData";

export default function Preventive() {
  let calendarRef;
  let calendarInstance;
  const [currentHours, setCurrentHours] = createSignal([]);

  onMount(async () => {
    try {
      const response = await fetch("/api/servicehour");
      const data = await response.json();

      const fullData = data.map(({ unit, jamoperasi }) => {
        const engine = engines().find((e) => e.unit === unit);
        return {
          unit,
          jamoperasi,
          mesin: engine ? `${engine.mesin} Unit ${engine.unit}` : `Unit ${unit}`,
        };
      });

      setCurrentHours(fullData);

      calendarInstance = new Calendar(calendarRef, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        events: generatePMSchedule(fullData),
        height: "auto",
        contentHeight: "auto",
        aspectRatio: 1.5,
        eventClick: function (info) {
          const targetUrl = info.event.extendedProps.url;
          if (targetUrl) {
            // Ambil eventId dari URL (asumsi format /preventive/detail/{id})
            const eventId = targetUrl.split("/").pop();

            // Dapatkan semua event dari kalender (array objek event)
            const allEvents = calendarInstance.getEvents();

            // Cari event yang id-nya sama dengan eventId dari URL
            const clickedEvent = allEvents.find((ev) => ev.id === eventId);

            if (clickedEvent) {
              // Siapkan data lengkap event sesuai permintaan yang akan disimpan ke localStorage
              const eventData = {
                id: clickedEvent.id,
                title: clickedEvent.title,
                start: clickedEvent.startStr,
                allDay: clickedEvent.allDay,
                color: clickedEvent.backgroundColor || clickedEvent.color,
                extendedProps: clickedEvent.extendedProps,
              };

              // Simpan ke localStorage
              localStorage.setItem("selectedEvent", JSON.stringify(eventData));
            }

            // Navigasi ke URL target
            window.location.href = targetUrl;
          }
        },
      });

      calendarInstance.render();
    } catch (error) {
      console.error("Failed to fetch service hour data:", error);
    }
  });

  onCleanup(() => {
    if (calendarInstance) {
      calendarInstance.destroy();
      calendarInstance = null;
    }
  });

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value !== "all") {
      window.location.href = `/preventive/unit/${value}`;
    }
  };

  return (
    <div>
      <div class="text-center mb-3">
        <h3 class="title">JADWAL PREVENTIVE MAINTENANCE</h3>
      </div>
      <div class="row">
        <div class="col-md-4 mx-auto mb-3">
          <label htmlFor="unitSelect" class="form-label">
            Pilih Mesin:
          </label>
          <select class="form-select" id="unitSelect" onChange={handleSelectChange} defaultValue="all">
            <option value="all">Semua Mesin</option>
            {currentHours().map(({ unit, mesin }) => (
              <option value={unit} key={unit}>
                {mesin}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div class="calendar-container mb-5">
        <div id="calendar">
          <div ref={(el) => (calendarRef = el)} />
        </div>
      </div>
    </div>
  );
}
