/* eslint-disable no-console */
const iterations = 100000;
const d = new Date();

function formatDateOld(d, language) {
  try {
    const locale = language === "ar" ? "ar-EG-u-ca-islamic" : "en-US";
    return d.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

const formatters = new Map();
function formatDateNew(d, language) {
  const locale = language === "ar" ? "ar-EG-u-ca-islamic" : "en-US";
  let formatter = formatters.get(locale);
  if (!formatter) {
    try {
      formatter = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      formatters.set(locale, formatter);
    } catch {
      formatter = formatters.get("en-US");
      if (!formatter) {
        formatter = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        formatters.set("en-US", formatter);
      }
      formatters.set(locale, formatter);
    }
  }
  return formatter.format(d);
}

// Warmup
for (let i = 0; i < 1000; i++) {
  formatDateOld(d, "en");
  formatDateOld(d, "ar");
  formatDateNew(d, "en");
  formatDateNew(d, "ar");
}

let start = performance.now();
for (let i = 0; i < iterations; i++) {
  formatDateOld(d, "en");
  formatDateOld(d, "ar");
}
let end = performance.now();
console.log("Old code:", end - start, "ms");

start = performance.now();
for (let i = 0; i < iterations; i++) {
  formatDateNew(d, "en");
  formatDateNew(d, "ar");
}
end = performance.now();
console.log("New code:", end - start, "ms");
