export const pmCycles = [
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


export const gantiOliHours = (sh, unit) => {
    const excludedUnits = [4, 5, 8, 9];

    if (sh <= 125) return 125;
    if (sh > 125 && sh <= 250) return 250;

    if (sh > 250 && sh <= 375 && !excludedUnits.includes(unit)) return 375;
    if (sh > 375 && sh <= 500 && !excludedUnits.includes(unit)) return 500;

    // Jika nilai sh di luar range yang didefinisikan, bisa tambahkan pengembalian default
    return null;
}
