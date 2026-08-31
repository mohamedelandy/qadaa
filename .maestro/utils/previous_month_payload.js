const now = new Date();
const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const previousMonth = `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, "0")}`;

const payload = {
  version: 1,
  wizardComplete: true,
  age: 28,
  pubertyAge: 14,
  periods: [{ type: "missed", years: 1 }],
  totalMissedDays: 365,
  prayers: {
    fajr: { recovered: 0 },
    dhuhr: { recovered: 0 },
    asr: { recovered: 0 },
    maghrib: { recovered: 0 },
    isha: { recovered: 0 },
  },
  todayPrayers: {},
  todayLogPoints: {},
  todayUnits: {},
  todayDate: null,
  streak: 0,
  lastLogDate: null,
  daysLogged: 0,
  loggedDates: [],
  points: 0,
  badges: [],
  language: "en",
  notificationTime: null,
  notificationPermission: "default",
  graceUsedMonth: previousMonth,
  lastDuaShownDate: null,
  intentionSetDate: null,
  dailyTarget: 5,
};

output.payload = JSON.stringify(payload);
