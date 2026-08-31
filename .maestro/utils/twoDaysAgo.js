// Maestro runScript helper: computes a local ISO date (YYYY-MM-DD) offset by
// -2 days from today for streak-break testing (2-day gap scenario).
function localISODate(offsetDays) {
  var d = new Date();
  d.setDate(d.getDate() + offsetDays);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}
output.twoDaysAgo = localISODate(-2);
