// Maestro runScript helper: computes a local ISO date (YYYY-MM-DD) offset by
// N days from today. The host runs Maestro on the same machine as the
// simulator in this project's local setup, so host-local and simulator-local
// dates agree. Exposed via `output.<name>` for ${output.*} interpolation.
function localISODate(offsetDays) {
  var d = new Date();
  d.setDate(d.getDate() + offsetDays);
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}
output.yesterday = localISODate(-1);
