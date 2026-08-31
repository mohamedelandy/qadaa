// Maestro runScript helper: computes the current local month (YYYY-MM) so a
// backup payload can set graceUsedMonth to the month that is active right now
// on the simulator. The host runs Maestro on the same machine as the
// simulator in this project's local setup, so host-local and simulator-local
// dates agree. Exposed via `output.currentMonth` for ${output.*} interpolation.
function localMonth() {
  var d = new Date();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  return d.getFullYear() + "-" + m;
}
output.currentMonth = localMonth();
