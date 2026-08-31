// Maestro runScript helper: computes the previous local month (YYYY-MM) so a
// backup payload can set graceUsedMonth to a month that is NOT the current one,
// making the grace day appear as "available" again.
function localMonth(offsetMonths) {
  var d = new Date();
  d.setMonth(d.getMonth() + offsetMonths);
  var m = String(d.getMonth() + 1).padStart(2, "0");
  return d.getFullYear() + "-" + m;
}
output.previousMonth = localMonth(-1);
