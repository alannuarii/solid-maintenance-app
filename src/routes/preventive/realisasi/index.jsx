import { onMount, onCleanup } from "solid-js";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./index.css";

const colorsByUnit = {
  1: "#FF5733",
  4: "#33FF57",
  5: "#3357FF",
  6: "#F1C40F",
  7: "#9B59B6",
  8: "#E67E22",
  9: "#1ABC9C",
};

export default function RealisasiPM() {
  let calendarRef;
  let calendarInstance;

  onMount(async () => {
    try {
      const res = await fetch("/api/realisasi/pm");
      const data = await res.json();

      // Transform data to events for FullCalendar
      const events = data.map((item) => ({
        id: String(item.id),
        title: `${item.pm} #${item.unit}`, // menampilkan pm + " #unit"
        start: item.waktu,
        allDay: true,
        backgroundColor: colorsByUnit[item.unit] || "#999999", // fallback warna abu2 jika unit tidak ada
        borderColor: colorsByUnit[item.unit] || "#999999",
        extendedProps: {
          unit: item.unit,
          pm: item.pm,
        },
      }));

      calendarInstance = new Calendar(calendarRef, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        events,
        height: "auto",
        contentHeight: "auto",
        aspectRatio: 1.5,
        eventClick: (info) => {
          alert(`Clicked event: ${info.event.title} (Unit ${info.event.extendedProps.unit})`);
        },
      });

      calendarInstance.render();
    } catch (error) {
      console.error("Failed to fetch PM data:", error);
    }
  });

  onCleanup(() => {
    calendarInstance?.destroy();
    calendarInstance = null;
  });

  return (
    <div>
      <div class="text-center mb-3">
        <h3 class="title">REALISASI PREVENTIVE MAINTENANCE</h3>
      </div>
      <div class="calendar-container mb-5">
        <div id="calendar">
          <div ref={(el) => (calendarRef = el)} />
        </div>
      </div>
    </div>
  );
}
