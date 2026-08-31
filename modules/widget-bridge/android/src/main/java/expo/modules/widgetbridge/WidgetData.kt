package expo.modules.widgetbridge

import android.content.Context
import android.util.Log
import org.json.JSONObject

internal data class WidgetData(
  val lang: String = "en",
  val totalRecovered: Int = 0,
  val totalTarget: Int = 0,
  val recoveredToday: Int = 0,
  val todayComplete: Boolean = false,
  val streak: Int = 0,
  val hadith: String = "",
  val prayers: List<PrayerRow> = emptyList(),
) {
  data class PrayerRow(val key: String, val recovered: Int, val target: Int)

  companion object {
    fun read(context: Context): WidgetData {
      val json = context
        .getSharedPreferences("qadaa_widget", Context.MODE_PRIVATE)
        .getString("widget_data", null)
      if (json.isNullOrBlank()) return WidgetData()
      return try {
        val obj = JSONObject(json)
        val rows = buildList {
          val arr = obj.optJSONArray("prayers")
          if (arr != null) {
            for (i in 0 until arr.length()) {
              val item = arr.optJSONObject(i) ?: continue
              add(PrayerRow(item.optString("key"), item.optInt("recovered"), item.optInt("target")))
            }
          }
        }
        WidgetData(
          lang = obj.optString("lang", "en"),
          totalRecovered = obj.optInt("totalRecovered"),
          totalTarget = obj.optInt("totalTarget"),
          recoveredToday = obj.optInt("recoveredToday"),
          todayComplete = obj.optBoolean("todayComplete"),
          streak = obj.optInt("streak"),
          hadith = obj.optString("hadith"),
          prayers = rows,
        )
      } catch (e: Exception) {
        Log.w("QadaaWidget", "Failed to parse widget payload", e)
        WidgetData()
      }
    }
  }
}

internal object WidgetLabels {
  fun isArabic(lang: String): Boolean = lang == "ar"

  fun appTitle(lang: String): String = if (isArabic(lang)) "قضاء" else "Qadaa"

  fun today(lang: String): String = if (isArabic(lang)) "اليوم" else "Today"

  fun total(lang: String): String = if (isArabic(lang)) "الإجمالي" else "Total"

  fun streak(lang: String): String = if (isArabic(lang)) "سلسلة الأيام" else "Day streak"

  fun prayer(key: String, lang: String): String {
    return when (key) {
      "fajr" -> if (isArabic(lang)) "الفجر" else "Fajr"
      "dhuhr" -> if (isArabic(lang)) "الظهر" else "Dhuhr"
      "asr" -> if (isArabic(lang)) "العصر" else "Asr"
      "maghrib" -> if (isArabic(lang)) "المغرب" else "Maghrib"
      "isha" -> if (isArabic(lang)) "العشاء" else "Isha"
      else -> key
    }
  }
}
