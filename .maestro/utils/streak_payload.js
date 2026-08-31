function localISODate(offsetDays) {
  var d = new Date();
  d.setDate(d.getDate() + offsetDays);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

var payload = {
  version: 1,
  wizardComplete: true,
  age: 28,
  pubertyAge: 14,
  periods: [{ type: "missed", years: 1 }],
  totalMissedDays: 3650,
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
  streak: 3,
  lastLogDate: localISODate(-1),
  daysLogged: 3,
  loggedDates: [],
  points: 30,
  badges: [],
  language: "en",
  notificationTime: null,
  notificationPermission: "default",
  graceUsedMonth: null,
  lastDuaShownDate: null,
  intentionSetDate: null,
  dailyTarget: 5,
};

output.payload = JSON.stringify(payload);
