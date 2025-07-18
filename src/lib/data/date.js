import { DateTime } from 'luxon';

export function convertTime(waktu, format = 3) {
    const dt = DateTime.fromISO(waktu, { zone: 'Asia/Makassar' });

    switch (format) {
        case 1:
            return `${dt.day} ${dt.setLocale('id').toFormat('LLLL')} ${dt.year} Pukul ${dt.hour} WITA`;
        case 2:
            return dt.toFormat('yyyy-MM-dd HH:mm:ss');
        case 3:
            return dt.setLocale('id').toFormat('cccc, d LLLL yyyy');
        default:
            return dt.toISO();  // fallback
    }
}
