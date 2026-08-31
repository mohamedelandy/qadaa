/** @format */
/**
 * Unit tests for building the home-screen widget payload.
 */
import { buildWidgetPayload } from "@domain/widget";
import { PRAYER_KEYS, type PrayerKey } from "@domain/types";
import { dayOfYear } from "@domain/date";
function makePrayers(recovered = 0): Record<
  PrayerKey,
  {
    recovered: number;
  }
> {
  return Object.fromEntries(PRAYER_KEYS.map((k) => [k, { recovered }])) as Record<
    PrayerKey,
    {
      recovered: number;
    }
  >;
}
const baseInput = {
  prayers: makePrayers(),
  todayPrayers: {} as Partial<Record<PrayerKey, true>>,
  totalMissedDays: 100,
  streak: 3,
  language: "ar" as const,
  hadiths: ["الحديث الأول", "الحديث الثاني"],
};
describe("buildWidgetPayload", () => {
  test("computes totals from prayers", () => {
    const payload = buildWidgetPayload({ ...baseInput, prayers: makePrayers(10) });
    expect(payload.totalRecovered).toBe(10 * PRAYER_KEYS.length);
    expect(payload.totalTarget).toBe(100 * PRAYER_KEYS.length);
  });
  test("recoveredToday counts logged prayer keys", () => {
    const payload = buildWidgetPayload({
      ...baseInput,
      todayPrayers: { fajr: true, dhuhr: true },
    });
    expect(payload.recoveredToday).toBe(2);
    expect(payload.todayComplete).toBe(false);
  });
  test("todayComplete true only when all prayer keys logged", () => {
    const all = Object.fromEntries(PRAYER_KEYS.map((k) => [k, true])) as Partial<
      Record<PrayerKey, true>
    >;
    expect(buildWidgetPayload({ ...baseInput, todayPrayers: all }).todayComplete).toBe(true);
    const missingOne = { ...all };
    delete missingOne.isha;
    expect(buildWidgetPayload({ ...baseInput, todayPrayers: missingOne }).todayComplete).toBe(
      false
    );
  });
  test("emits per-prayer rows in fixed order with target", () => {
    const payload = buildWidgetPayload({ ...baseInput, prayers: makePrayers(7) });
    expect(payload.prayers.map((p) => p.key)).toEqual([...PRAYER_KEYS]);
    payload.prayers.forEach((p) => {
      expect(p.recovered).toBe(7);
      expect(p.target).toBe(100);
    });
  });
  test("rotates hadith by day of year", () => {
    const payload = buildWidgetPayload(baseInput);
    const expected = baseInput.hadiths[dayOfYear(new Date()) % baseInput.hadiths.length] ?? "";
    expect(payload.hadith).toBe(expected);
  });
  test("empty hadiths produces empty hadith string", () => {
    expect(buildWidgetPayload({ ...baseInput, hadiths: [] }).hadith).toBe("");
  });
  test("passes through language and streak", () => {
    const payload = buildWidgetPayload({ ...baseInput, language: "en" });
    expect(payload.lang).toBe("en");
    expect(payload.streak).toBe(3);
  });
  test("zero-state when totalMissedDays is zero", () => {
    const payload = buildWidgetPayload({ ...baseInput, totalMissedDays: 0 });
    expect(payload.totalTarget).toBe(0);
    payload.prayers.forEach((p) => expect(p.target).toBe(0));
  });
});
