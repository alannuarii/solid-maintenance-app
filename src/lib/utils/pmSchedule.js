export const generatePMSchedule = (units) => {
    const pmCycles = [
        { min: 0, max: 125, pm: "P1" },
        { min: 125, max: 250, pm: "P2" },
        { min: 250, max: 375, pm: "P1" },
        { min: 375, max: 500, pm: "P3" },
        { min: 500, max: 625, pm: "P1" },
        { min: 625, max: 750, pm: "P2" },
        { min: 750, max: 875, pm: "P1" },
        { min: 875, max: 1000, pm: "P3" },
        { min: 1000, max: 1125, pm: "P1" },
        { min: 1125, max: 1250, pm: "P2" },
        { min: 1250, max: 1375, pm: "P1" },
        { min: 1375, max: 1500, pm: "P4" },
        { min: 1500, max: 1625, pm: "P1" },
        { min: 1625, max: 1750, pm: "P2" },
        { min: 1750, max: 1875, pm: "P1" },
        { min: 1875, max: 2000, pm: "P3" },
        { min: 2000, max: 2125, pm: "P1" },
        { min: 2125, max: 2250, pm: "P2" },
        { min: 2250, max: 2375, pm: "P1" },
        { min: 2375, max: 2500, pm: "P3" },
        { min: 2500, max: 2625, pm: "P1" },
        { min: 2625, max: 2750, pm: "P2" },
        { min: 2750, max: 2875, pm: "P1" },
        { min: 2875, max: 3000, pm: "P5" },
    ];

    const colorsByUnit = {
        1: "#FF5733",
        4: "#33FF57",
        5: "#3357FF",
        6: "#F1C40F",
        7: "#9B59B6",
        8: "#E67E22",
        9: "#1ABC9C",
    };

    const oneYearHours = 24 * 1825;
    const maxIterations = 300;

    let allSchedules = [];

    units.forEach(({ unit, jamoperasi }) => {
        let reducedHours = jamoperasi % 3000;
        let baseDate = new Date();
        let totalProcessedHours = 0;
        let cycleHours = reducedHours;

        for (let i = 0; i < maxIterations; i++) {
            const pmCycle = pmCycles.find((cycle) => cycle.min <= cycleHours && cycleHours < cycle.max);
            if (!pmCycle) break;

            const targetHours = pmCycle.max;
            const hoursToNextPM = targetHours - cycleHours;

            if (hoursToNextPM <= 0) break;
            if (totalProcessedHours + hoursToNextPM > oneYearHours) break;

            const daysToNextPM = hoursToNextPM / 24;
            let pmDate = new Date(baseDate);
            pmDate.setDate(pmDate.getDate() + Math.ceil(daysToNextPM));

            allSchedules.push({
                title: `${pmCycle.pm} #${unit}`,
                start: pmDate.toISOString().slice(0, 10),
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
            totalProcessedHours += hoursToNextPM;
            baseDate = pmDate;
        }
    });

    return allSchedules;
}