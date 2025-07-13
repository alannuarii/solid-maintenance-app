import { onMount, onCleanup, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import { generatePMSchedule } from "../../../lib/utils/pmSchedule";
import "./index.css";

export default function PreventiveUnit() {
  let calendarRef;
  let calendarInstance;
  const params = useParams();

  const unitToMesinMap = {
    1: "SWD 6FHD 240 Unit 1",
    4: "Deutz MWM 212 V12 Unit 4",
    5: "Deutz MWM 212 V12 Unit 5",
    6: "Mitsubishi S16R PTA-S Unit 6",
    7: "Mitsubishi S16R PTA-S Unit 7",
    8: "Cummins KTA50-G8 Unit 8",
    9: "Cummins KTA50-G8 Unit 9",
  };

  const [currentHours, setCurrentHours] = createSignal([]);

  onMount(async () => {
    try {
      const unit = params.unit;
      const response = await fetch(`/api/servicehour/${unit}`);
      const data = await response.json();

      const fullData = data.map(({ unit, jamoperasi }) => ({
        unit,
        jamoperasi,
        mesin: unitToMesinMap[unit] || `Unit ${unit}`,
      }));

      setCurrentHours(fullData);

      // initialize calendar once
      calendarInstance = new Calendar(calendarRef, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        events: generatePMSchedule(fullData),
        height: "auto",
        contentHeight: "auto",
        aspectRatio: 1.5,
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

  return (
    <div>
      <div class="text-center mb-3">
        <h3 class="title">JADWAL PREVENTIVE MAINTENANCE</h3>
      </div>
      <div class="calendar-container mb-5">
        <div id="calendar">
          <div ref={(el) => (calendarRef = el)} />
        </div>
      </div>
    </div>
  );
}
