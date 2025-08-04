import { json } from "@solidjs/router";
import { generatePMSchedule } from "~/lib/utils/pmSchedule"

function getStartAndEndDate() {
    const today = new Date();
    const startDate = today.toISOString().slice(0, 10);

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    if (month === 12) {
        year += 1;
        month = 1;
    } else {
        month += 1;
    }

    const endDateObj = new Date(year, month + 1 - 1, 0);
    const endDate = endDateObj.toISOString().slice(0, 10);

    return [startDate, endDate];
}

export async function GET() {
    try {
        const response = await fetch("http://localhost:3000/api/servicehour");
        const data = await response.json();

        const [startDate, endDate] = getStartAndEndDate();
        const schedules = generatePMSchedule(data, startDate, endDate);
        console.log(schedules)
        const result = schedules.map((schedule) => ({
            unit: schedule.extendedProps.unit,
            pm: schedule.title.split(' ')[0],
            waktu: schedule.start,
            currentHours: schedule.extendedProps.currentHours,
            targetHours: schedule.extendedProps.targetHours
        }));
        return json(result);
    } catch (error) {
        console.error("Error saat GET data", error);
        return json({ error: "Internal Server Error" }, { status: 500 });
    }
}
