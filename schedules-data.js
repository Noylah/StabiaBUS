// Bus Schedules Database
// Castellammare di Stabia - Lettere Route

const SCHEDULES_DATA = {
    andata_verso_castellammare: {
        fermate_ordine: [
            "Lettere (Orsano)",
            "Depugliano",
            "Casola",
            "Gragnano (P.zza S.Leone)",
            "Castellammare Itis",
            "Castellammare di Stabia"
        ],
        corse: [
            { id: 1, tipo: "F", orari: { "Lettere (Orsano)": "05:50", "Casola": "06:00", "Gragnano (P.zza S.Leone)": "06:10", "Castellammare di Stabia": "06:40" } },
            { id: 2, tipo: "F", orari: { "Lettere (Orsano)": "06:40", "Casola": "06:50", "Gragnano (P.zza S.Leone)": "07:00", "Castellammare di Stabia": "07:30" } },
            { id: 3, tipo: "S", orari: { "Lettere (Orsano)": "07:00", "Casola": "07:10", "Gragnano (P.zza S.Leone)": "07:20", "Castellammare Itis": "07:55" } },
            { id: 4, tipo: "S", orari: { "Depugliano": "07:00", "Casola": "07:20", "Gragnano (P.zza S.Leone)": "07:25", "Castellammare Itis": "07:55" } },
            { id: 5, tipo: "F", orari: { "Lettere (Orsano)": "07:20", "Casola": "07:30", "Gragnano (P.zza S.Leone)": "07:40", "Castellammare di Stabia": "08:10" } },
            { id: 6, tipo: "S", orari: { "Depugliano": "07:25", "Casola": "07:45", "Gragnano (P.zza S.Leone)": "07:50", "Castellammare Itis": "08:20" } },
            { id: 7, tipo: "F", orari: { "Lettere (Orsano)": "07:50", "Casola": "08:00", "Gragnano (P.zza S.Leone)": "08:10", "Castellammare di Stabia": "08:40" } },
            { id: 8, tipo: "F", orari: { "Lettere (Orsano)": "08:45", "Casola": "08:55", "Gragnano (P.zza S.Leone)": "09:05", "Castellammare di Stabia": "09:35" } },
            { id: 9, tipo: "H", orari: { "Lettere (Orsano)": "09:00", "Casola": "09:10", "Gragnano (P.zza S.Leone)": "09:20", "Castellammare di Stabia": "09:50" } },
            { id: 10, tipo: "F", orari: { "Lettere (Orsano)": "09:50", "Casola": "10:00", "Gragnano (P.zza S.Leone)": "10:10", "Castellammare di Stabia": "10:40" } },
            { id: 11, tipo: "F", orari: { "Lettere (Orsano)": "10:20", "Casola": "10:30", "Gragnano (P.zza S.Leone)": "10:40", "Castellammare di Stabia": "11:10" } },
            { id: 12, tipo: "H", orari: { "Lettere (Orsano)": "11:10", "Casola": "11:20", "Gragnano (P.zza S.Leone)": "11:30", "Castellammare di Stabia": "12:00" } },
            { id: 13, tipo: "F", orari: { "Lettere (Orsano)": "11:55", "Casola": "12:05", "Gragnano (P.zza S.Leone)": "12:15", "Castellammare di Stabia": "12:45" } },
            { id: 14, tipo: "S", orari: { "Lettere (Orsano)": "12:20", "Casola": "12:30", "Gragnano (P.zza S.Leone)": "12:40", "Castellammare di Stabia": "13:10" } },
            { id: 15, tipo: "LS", orari: { "Lettere (Orsano)": "13:10", "Casola": "13:20", "Gragnano (P.zza S.Leone)": "13:30" } },
            { id: 16, tipo: "F", orari: { "Lettere (Orsano)": "13:00", "Casola": "13:10", "Gragnano (P.zza S.Leone)": "13:20", "Castellammare di Stabia": "13:50" } },
            { id: 17, tipo: "H", orari: { "Lettere (Orsano)": "13:30", "Casola": "13:40", "Gragnano (P.zza S.Leone)": "13:50" } },
            { id: 18, tipo: "F", orari: { "Lettere (Orsano)": "14:10", "Casola": "14:20", "Gragnano (P.zza S.Leone)": "14:30", "Castellammare di Stabia": "15:00" } },
            { id: 19, tipo: "F", orari: { "Lettere (Orsano)": "14:40", "Casola": "14:50", "Gragnano (P.zza S.Leone)": "15:00" } },
            { id: 20, tipo: "F", orari: { "Lettere (Orsano)": "15:30", "Casola": "15:40", "Gragnano (P.zza S.Leone)": "15:50" } },
            { id: 21, tipo: "H", orari: { "Lettere (Orsano)": "15:30", "Casola": "15:40", "Gragnano (P.zza S.Leone)": "15:50", "Castellammare di Stabia": "16:20" } },
            { id: 22, tipo: "F", orari: { "Lettere (Orsano)": "16:15", "Casola": "16:25", "Gragnano (P.zza S.Leone)": "16:35", "Castellammare di Stabia": "17:05" } },
            { id: 23, tipo: "F", orari: { "Lettere (Orsano)": "17:05", "Casola": "17:15", "Gragnano (P.zza S.Leone)": "17:25", "Castellammare di Stabia": "17:55" } },
            { id: 24, tipo: "G", orari: { "Lettere (Orsano)": "18:00", "Casola": "18:10", "Gragnano (P.zza S.Leone)": "18:20", "Castellammare di Stabia": "18:50" } },
            { id: 25, tipo: "F", orari: { "Lettere (Orsano)": "19:35", "Casola": "19:45", "Gragnano (P.zza S.Leone)": "19:55", "Castellammare di Stabia": "20:25" } },
            { id: 26, tipo: "H", orari: { "Lettere (Orsano)": "20:00", "Casola": "20:10", "Gragnano (P.zza S.Leone)": "20:20" } },
            { id: 27, tipo: "F", orari: { "Lettere (Orsano)": "20:25", "Casola": "20:35", "Gragnano (P.zza S.Leone)": "20:45", "Castellammare di Stabia": "21:15" } }
        ]
    },
    ritorno_verso_lettere: {
        fermate_ordine: [
            "Castellammare di Stabia",
            "Castellammare Itis",
            "Gragnano (Via C.mare)",
            "Gragnano (P.zza S.Leone)",
            "Casola",
            "Depugliano",
            "Lettere (Orsano)"
        ],
        corse: [
            { id: 1, tipo: "F", orari: { "Castellammare di Stabia": "06:20", "Gragnano (Via C.mare)": "06:40", "Gragnano (P.zza S.Leone)": "06:50", "Casola": "06:55", "Lettere (Orsano)": "07:10" } },
            { id: 2, tipo: "F", orari: { "Castellammare di Stabia": "06:50", "Gragnano (Via C.mare)": "07:10", "Gragnano (P.zza S.Leone)": "07:20", "Casola": "07:25", "Lettere (Orsano)": "07:40" } },
            { id: 3, tipo: "F", orari: { "Castellammare di Stabia": "07:50", "Gragnano (Via C.mare)": "08:10", "Gragnano (P.zza S.Leone)": "08:20", "Casola": "08:25", "Lettere (Orsano)": "08:40" } },
            { id: 4, tipo: "H", orari: { "Gragnano (Via C.mare)": "08:25", "Gragnano (P.zza S.Leone)": "08:35", "Casola": "08:45", "Lettere (Orsano)": "08:55" } },
            { id: 5, tipo: "F", orari: { "Castellammare di Stabia": "08:45", "Gragnano (Via C.mare)": "09:05", "Gragnano (P.zza S.Leone)": "09:15", "Casola": "09:20", "Lettere (Orsano)": "09:35" } },
            { id: 6, tipo: "F", orari: { "Castellammare di Stabia": "09:15", "Gragnano (Via C.mare)": "09:35", "Gragnano (P.zza S.Leone)": "09:45", "Casola": "09:50", "Lettere (Orsano)": "10:05" } },
            { id: 7, tipo: "H", orari: { "Castellammare di Stabia": "10:00", "Gragnano (Via C.mare)": "10:20", "Gragnano (P.zza S.Leone)": "10:30", "Casola": "10:35", "Lettere (Orsano)": "10:50" } },
            { id: 8, tipo: "F", orari: { "Castellammare di Stabia": "11:00", "Gragnano (Via C.mare)": "11:20", "Gragnano (P.zza S.Leone)": "11:30", "Casola": "11:35", "Lettere (Orsano)": "11:50" } },
            { id: 9, tipo: "F", orari: { "Castellammare di Stabia": "11:30", "Gragnano (Via C.mare)": "11:50", "Gragnano (P.zza S.Leone)": "12:00" } },
            { id: 10, tipo: "S", orari: { "Gragnano (Via C.mare)": "11:45", "Gragnano (P.zza S.Leone)": "11:55", "Casola": "12:00", "Lettere (Orsano)": "12:15" } },
            { id: 11, tipo: "F", orari: { "Castellammare di Stabia": "12:00", "Gragnano (Via C.mare)": "12:20", "Gragnano (P.zza S.Leone)": "12:30", "Casola": "12:35", "Lettere (Orsano)": "12:50" } },
            { id: 12, tipo: "6S", orari: { "Castellammare Itis": "12:10", "Gragnano (Via C.mare)": "12:30", "Gragnano (P.zza S.Leone)": "12:40", "Casola": "12:45", "Lettere (Orsano)": "12:55" } },
            { id: 13, tipo: "S", orari: { "Castellammare di Stabia": "12:20", "Gragnano (Via C.mare)": "12:40", "Gragnano (P.zza S.Leone)": "12:50", "Casola": "12:55", "Lettere (Orsano)": "13:10" } },
            { id: 14, tipo: "H", orari: { "Castellammare di Stabia": "12:40", "Gragnano (Via C.mare)": "13:00", "Gragnano (P.zza S.Leone)": "13:10", "Casola": "13:15", "Lettere (Orsano)": "13:30" } },
            { id: 15, tipo: "F", orari: { "Castellammare di Stabia": "13:15", "Gragnano (Via C.mare)": "13:35", "Gragnano (P.zza S.Leone)": "13:45", "Casola": "13:50", "Lettere (Orsano)": "14:05" } },
            { id: 16, tipo: "S", orari: { "Castellammare di Stabia": "13:15", "Gragnano (Via C.mare)": "13:35", "Gragnano (P.zza S.Leone)": "13:45", "Casola": "13:50", "Depugliano": "14:00" } },
            { id: 17, tipo: "F", orari: { "Castellammare di Stabia": "13:45", "Gragnano (Via C.mare)": "14:05", "Gragnano (P.zza S.Leone)": "14:15", "Casola": "14:20", "Lettere (Orsano)": "14:35" } },
            { id: 18, tipo: "LS", orari: { "Castellammare di Stabia": "13:50", "Gragnano (Via C.mare)": "14:05", "Gragnano (P.zza S.Leone)": "14:15", "Casola": "14:20", "Depugliano": "14:40" } },
            { id: 19, tipo: "F", orari: { "Castellammare di Stabia": "14:30", "Gragnano (Via C.mare)": "14:50", "Gragnano (P.zza S.Leone)": "15:00", "Casola": "15:05", "Lettere (Orsano)": "15:20" } },
            { id: 20, tipo: "LS", orari: { "Castellammare Itis": "14:10", "Gragnano (Via C.mare)": "14:25", "Gragnano (P.zza S.Leone)": "14:35", "Casola": "14:40", "Lettere (Orsano)": "14:55" } },
            { id: 21, tipo: "F", orari: { "Gragnano (P.zza S.Leone)": "15:20", "Casola": "15:25", "Lettere (Orsano)": "15:35" } },
            { id: 22, tipo: "F", orari: { "Castellammare di Stabia": "15:15", "Gragnano (Via C.mare)": "15:35", "Gragnano (P.zza S.Leone)": "15:45", "Casola": "15:50", "Lettere (Orsano)": "16:00" } },
            { id: 23, tipo: "H", orari: { "Gragnano (Via C.mare)": "14:55", "Gragnano (P.zza S.Leone)": "15:05", "Casola": "15:15", "Lettere (Orsano)": "15:25" } },
            { id: 24, tipo: "F", orari: { "Castellammare di Stabia": "16:00", "Gragnano (Via C.mare)": "16:20", "Gragnano (P.zza S.Leone)": "16:30", "Casola": "16:35", "Lettere (Orsano)": "16:50" } },
            { id: 25, tipo: "G", orari: { "Castellammare di Stabia": "17:00", "Gragnano (Via C.mare)": "17:20", "Gragnano (P.zza S.Leone)": "17:30", "Casola": "17:35", "Lettere (Orsano)": "17:50" } },
            { id: 26, tipo: "F", orari: { "Castellammare di Stabia": "18:20", "Gragnano (Via C.mare)": "18:40", "Gragnano (P.zza S.Leone)": "18:50", "Casola": "18:55", "Lettere (Orsano)": "19:10" } },
            { id: 27, tipo: "H", orari: { "Castellammare di Stabia": "19:10", "Gragnano (Via C.mare)": "19:30", "Gragnano (P.zza S.Leone)": "19:40", "Casola": "19:45", "Lettere (Orsano)": "20:00" } },
            { id: 28, tipo: "F", orari: { "Castellammare di Stabia": "19:30", "Gragnano (Via C.mare)": "19:50", "Gragnano (P.zza S.Leone)": "20:00", "Casola": "20:05", "Lettere (Orsano)": "20:20" } },
            { id: 29, tipo: "F", orari: { "Castellammare di Stabia": "20:55", "Gragnano (Via C.mare)": "21:15", "Gragnano (P.zza S.Leone)": "21:25", "Casola": "21:40", "Lettere (Orsano)": "21:45" } },
            { id: 30, tipo: "F", orari: { "Castellammare di Stabia": "21:25", "Gragnano (Via C.mare)": "21:40", "Gragnano (P.zza S.Leone)": "21:55", "Casola": "22:00", "Lettere (Orsano)": "22:15" } }
        ]
    }
};

// Schedule type descriptions
const SCHEDULE_TYPES = {
    'F': 'Feriale (Lun-Sab)',
    'H': 'Festivo (Dom e Festivi)',
    'G': 'Giornaliera (Tutti i giorni)',
    'L': 'Lunedì-Venerdì',
    'S': 'Scolastica',
    '6': 'Sabato',
    'LS': 'Lun-Ven Scolastico',
    '6S': 'Sabato Scolastico'
};
