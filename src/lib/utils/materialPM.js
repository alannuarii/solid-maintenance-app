
import { fastMovingMaterials } from "../../../public/data/fastMoving";

export function addMaterialsToSchedule(scheduleArray) {
    // Define ordered cycles for comparison
    const orderedCycles = ["P1", "P2", "P3", "P4", "P5"];

    return scheduleArray.map(item => {
        // Extract cycle and unit from title, e.g., "P1 #9"
        const [cycle, unitWithHash] = item.title.split(' ');
        const unit = parseInt(unitWithHash.replace('#', ''), 10);

        // Find material data for the unit
        const unitMaterialData = fastMovingMaterials.find(m => m.unit === unit);

        // Determine cycles to include up to current cycle
        const cycleIndex = orderedCycles.indexOf(cycle);
        const allowedCycles = orderedCycles.slice(0, cycleIndex + 1);

        // Filter materials that have cycle in allowedCycles
        const materialsForCycle = unitMaterialData
            ? unitMaterialData.material.filter(m => allowedCycles.includes(m.cycle))
            : [];

        // Return new object with materials added
        return {
            ...item,
            material: materialsForCycle
        };
    });
}

export function sumMaterialsAndPMByCycle(scheduleArray) {
    const orderedCycles = ["P1", "P2", "P3", "P4", "P5"];

    const pm = {
        totalPM: 0,
        cycles: orderedCycles.map(cycle => ({ cycle, total: 0 }))
    };

    const materialTotals = {};

    scheduleArray.forEach(item => {
        pm.totalPM += 1;

        const [cycle, unitWithHash] = item.title.split(' ');
        const unit = parseInt(unitWithHash.replace('#', ''), 10);
        const unitMaterialData = fastMovingMaterials.find(m => m.unit === unit);

        // Hitung jumlah per siklus PM
        const cycleIndex = orderedCycles.indexOf(cycle);
        if (cycleIndex !== -1) {
            pm.cycles[cycleIndex].total += 1;
        }

        if (!unitMaterialData) return;

        // Pilih cycle material hingga cycle saat ini
        const allowedCycles = orderedCycles.slice(0, cycleIndex + 1);

        // Filter material yang cycle nya sesuai dengan allowed cycles
        const filteredMaterials = unitMaterialData.material.filter(m => allowedCycles.includes(m.cycle));

        filteredMaterials.forEach(m => {
            const key = `${m.nama} (${m.satuan})`;
            if (!materialTotals[key]) {
                materialTotals[key] = 0;
            }
            materialTotals[key] += m.jumlah;
        });
    });

    return {
        pm,
        totalMaterials: Object.entries(materialTotals).map(([key, jumlah]) => {
            const match = key.match(/(.+)\s\((.+)\)/);
            return {
                nama: match[1],
                jumlah,
                satuan: match[2]
            };
        })
    };
}