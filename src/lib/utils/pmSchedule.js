import { pmCycles } from "../../../public/data/pmCycles.js";
import { DateTime } from "luxon";

export const generatePMSchedule = (units, startDateStr = null, endDateStr = null) => {
    const colorsByUnit = {
        1: "#FF5733",
        4: "#33FF57",
        5: "#3357FF",
        6: "#F1C40F",
        7: "#9B59B6",
        8: "#E67E22",
        9: "#1ABC9C",
    };

    const fiveYearHours = 24 * 1825; // default 5 years in hours
    const maxIterations = 1000;

    // Zona waktu Asia/Makassar dengan Luxon
    const zone = "Asia/Makassar";

    // Tanggal hari ini dengan zona waktu Asia/Makassar, direset ke awal hari (00:00)
    const today = DateTime.now().setZone(zone).startOf('day');

    // Parsing dan validasi tanggal mulai
    let baseDate = startDateStr ? DateTime.fromISO(startDateStr, { zone }) : DateTime.now().setZone(zone);
    baseDate = baseDate.startOf('day');
    if (baseDate < today) {
        baseDate = today;
    }

    // Parsing tanggal akhir, jika tidak ada pakai default durasi 5 tahun dari baseDate
    let endDate = endDateStr ? DateTime.fromISO(endDateStr, { zone }).endOf('day') : baseDate.plus({ hours: fiveYearHours }).endOf('day');

    let allSchedules = [];

    units.forEach(({ unit, jamoperasi }) => {
        let reducedHours = jamoperasi % 3000;
        let cycleHours = reducedHours;
        let currentBaseDate = baseDate;

        for (let i = 0; i < maxIterations; i++) {
            const pmCycle = pmCycles.find((cycle) => cycle.min <= cycleHours && cycleHours < cycle.max);
            if (!pmCycle) break;

            const targetHours = pmCycle.max;
            const hoursToNextPM = targetHours - cycleHours;

            if (hoursToNextPM <= 0) break;

            const daysToNextPM = hoursToNextPM / 24;
            let pmDate = currentBaseDate.plus({ days: Math.ceil(daysToNextPM) });

            if (pmDate > endDate) break;

            allSchedules.push({
                title: `${pmCycle.pm} #${unit}`,
                start: pmDate.toISODate(),
                allDay: true,
                color: colorsByUnit[unit] || "#000000",
                extendedProps: {
                    currentHours: cycleHours,
                    targetHours: targetHours,
                    daysFromToday: daysToNextPM,
                    unit: unit,
                },
            });

            cycleHours = targetHours;
            if (cycleHours >= 3000) cycleHours -= 3000;
            currentBaseDate = pmDate;
        }
    });

    return allSchedules;
};

