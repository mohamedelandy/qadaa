package expo.modules.widgetbridge

import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceModifier
import androidx.glance.GlanceId
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.LocalSize
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.LinearProgressIndicator
import androidx.glance.appwidget.SizeMode
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.appwidget.cornerRadius
import androidx.glance.appwidget.provideContent
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.ContentScale
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxHeight
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.size
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider
import kotlin.math.min

private const val DAILY_TARGET = 5

private val Small = DpSize(110.dp, 110.dp)
private val Medium = DpSize(250.dp, 110.dp)
private val Large = DpSize(250.dp, 250.dp)

private fun parseHexColor(hex: String): Color = Color(android.graphics.Color.parseColor(hex))

private fun colorProvider(hex: String): ColorProvider = ColorProvider(parseHexColor(hex))

private data class QadaaPalette(
  val backgroundRes: Int,
  val accent: ColorProvider,
  val accentStart: ColorProvider,
  val accentEnd: ColorProvider,
  val textPrimary: ColorProvider,
  val textSecondary: ColorProvider,
  val textTertiary: ColorProvider,
  val flame: ColorProvider,
  val track: ColorProvider,
  val ringInner: ColorProvider,
) {
  companion object {
    fun resolve(context: Context): QadaaPalette {
      val dark =
        (context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
          Configuration.UI_MODE_NIGHT_YES
      return if (dark) {
        QadaaPalette(
          backgroundRes = R.drawable.widget_bg_dark,
          accent = colorProvider("#34D399"),
          accentStart = colorProvider("#047857"),
          accentEnd = colorProvider("#34D399"),
          textPrimary = colorProvider("#F1F5F9"),
          textSecondary = colorProvider("#94A3B8"),
          textTertiary = colorProvider("#475569"),
          flame = colorProvider("#FBBF24"),
          track = colorProvider("#2634D399"),
          ringInner = colorProvider("#0C1626"),
        )
      } else {
        QadaaPalette(
          backgroundRes = R.drawable.widget_bg_light,
          accent = colorProvider("#047857"),
          accentStart = colorProvider("#047857"),
          accentEnd = colorProvider("#34D399"),
          textPrimary = colorProvider("#0F172A"),
          textSecondary = colorProvider("#475569"),
          textTertiary = colorProvider("#94A3B8"),
          flame = colorProvider("#D97706"),
          track = colorProvider("#1F047857"),
          ringInner = colorProvider("#FFFFFF"),
        )
      }
    }
  }
}

private fun ringDrawable(count: Int): Int? = when (count) {
  1 -> R.drawable.widget_ring_p1
  2 -> R.drawable.widget_ring_p2
  3 -> R.drawable.widget_ring_p3
  4 -> R.drawable.widget_ring_p4
  5 -> R.drawable.widget_ring_p5
  else -> null
}

private fun textStyle(
  color: ColorProvider,
  size: TextUnit = 11.sp,
  bold: Boolean = false,
  rtl: Boolean = false,
): TextStyle = TextStyle(
  color = color,
  fontSize = size,
  fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal,
)

class QadaaWidget : GlanceAppWidget() {
  override val sizeMode = SizeMode.Responsive(setOf(Small, Medium, Large))

  override suspend fun provideGlance(context: Context, id: GlanceId) {
    val data = WidgetData.read(context)
    val palette = QadaaPalette.resolve(context)
    val rtl = WidgetLabels.isArabic(data.lang)

    provideContent {
      Column(
        modifier = GlanceModifier.fillMaxSize()
          .background(ImageProvider(palette.backgroundRes), ContentScale.FillBounds)
          .cornerRadius(16.dp)
          .clickable(
            actionStartActivity(
              Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_LAUNCHER)
                setPackage(context.packageName)
              }
            )
          )
          .padding(14.dp),
        verticalAlignment = Alignment.CenterVertically,
      ) {
        when (LocalSize.current) {
          Medium -> MediumContent(data, palette, rtl)
          Large -> LargeContent(data, palette, rtl)
          else -> SmallContent(data, palette, rtl)
        }
      }
    }
  }
}

@Composable
private fun SmallContent(data: WidgetData, palette: QadaaPalette, rtl: Boolean) {
  Column(
    horizontalAlignment = Alignment.CenterHorizontally,
    verticalAlignment = Alignment.CenterVertically,
  ) {
    Box(contentAlignment = Alignment.Center, modifier = GlanceModifier.size(74.dp)) {
      Image(
        provider = ImageProvider(R.drawable.widget_ring_track),
        contentDescription = null,
        modifier = GlanceModifier.fillMaxSize(),
        contentScale = ContentScale.FillBounds,
      )
      ringDrawable(data.recoveredToday)?.let { res ->
        Image(
          provider = ImageProvider(res),
          contentDescription = null,
          modifier = GlanceModifier.fillMaxSize(),
          contentScale = ContentScale.FillBounds,
        )
      }
      Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Row(verticalAlignment = Alignment.Bottom) {
          Text("${data.recoveredToday}", style = textStyle(palette.textPrimary, 20.sp, bold = true, rtl = rtl))
          Text("/$DAILY_TARGET", style = textStyle(palette.textSecondary, 11.sp, bold = true, rtl = rtl))
        }
        Text(
          WidgetLabels.today(data.lang).uppercase(),
          style = textStyle(palette.accent, 7.sp, bold = true, rtl = rtl),
        )
      }
    }
    Spacer(GlanceModifier.height(6.dp))
    Text("${data.totalRecovered} / ${data.totalTarget}", style = textStyle(palette.textSecondary, 11.sp, bold = true, rtl = rtl))
    if (data.streak > 0) {
      Spacer(GlanceModifier.height(2.dp))
      Text("🔥 ${data.streak}", style = textStyle(palette.flame, 10.sp, bold = true, rtl = rtl))
    }
  }
}

@Composable
private fun PrayerRow(
  row: WidgetData.PrayerRow,
  lang: String,
  palette: QadaaPalette,
  rtl: Boolean,
  showTarget: Boolean,
) {
  val done = row.target > 0 && row.recovered >= row.target
  val name: @Composable () -> Unit = {
    Text(WidgetLabels.prayer(row.key, lang), style = textStyle(palette.textSecondary, 10.sp, rtl = rtl), maxLines = 1)
  }
  val count: @Composable () -> Unit = {
    val label = when {
      done -> "✓"
      showTarget -> "${row.recovered}/${row.target}"
      else -> "${row.recovered}"
    }
    Text(label, style = textStyle(if (done) palette.accent else palette.textPrimary, 10.sp, bold = true, rtl = rtl))
  }
  Row(modifier = GlanceModifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
    if (rtl) {
      count()
      Spacer(GlanceModifier.width(7.dp))
      LinearProgressIndicator(
        progress = if (row.target > 0) min(1f, row.recovered.toFloat() / row.target) else 0f,
        modifier = GlanceModifier.defaultWeight().height(4.dp).padding(vertical = 2.dp),
        color = palette.accentEnd,
        backgroundColor = palette.track,
      )
      Spacer(GlanceModifier.width(7.dp))
      name()
    } else {
      name()
      Spacer(GlanceModifier.width(7.dp))
      LinearProgressIndicator(
        progress = if (row.target > 0) min(1f, row.recovered.toFloat() / row.target) else 0f,
        modifier = GlanceModifier.defaultWeight().height(4.dp).padding(vertical = 2.dp),
        color = palette.accentEnd,
        backgroundColor = palette.track,
      )
      Spacer(GlanceModifier.width(7.dp))
      count()
    }
  }
}

@Composable
private fun DailySegments(filled: Int, lang: String, palette: QadaaPalette, rtl: Boolean) {
  Row(modifier = GlanceModifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
    Text(
      WidgetLabels.today(lang).uppercase(),
      style = textStyle(palette.accent, 8.sp, bold = true, rtl = rtl),
    )
    Spacer(GlanceModifier.width(6.dp))
    Row(modifier = GlanceModifier.defaultWeight(), horizontalAlignment = Alignment.Start) {
      repeat(DAILY_TARGET) { i ->
        Box(
          modifier = GlanceModifier.defaultWeight()
            .height(5.dp)
            .padding(horizontal = 1.dp)
            .background(if (i < filled) palette.accentEnd else palette.track)
            .cornerRadius(3.dp),
        ) {}
      }
    }
  }
}

@Composable
private fun MediumContent(data: WidgetData, palette: QadaaPalette, rtl: Boolean) {
  Column {
    Row(modifier = GlanceModifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
      Text(WidgetLabels.appTitle(data.lang), style = textStyle(palette.accent, 11.sp, bold = true, rtl = rtl))
      Spacer(GlanceModifier.defaultWeight())
      Text("${data.totalRecovered} / ${data.totalTarget}", style = textStyle(palette.textSecondary, 10.sp, bold = true, rtl = rtl))
      if (data.streak > 0) {
        Spacer(GlanceModifier.width(8.dp))
        Text("🔥 ${data.streak}", style = textStyle(palette.flame, 10.sp, bold = true, rtl = rtl))
      }
    }
    Spacer(GlanceModifier.height(8.dp))
    Row(verticalAlignment = Alignment.CenterVertically) {
      Box(contentAlignment = Alignment.Center, modifier = GlanceModifier.size(58.dp)) {
        Image(
          provider = ImageProvider(R.drawable.widget_ring_track),
          contentDescription = null,
          modifier = GlanceModifier.fillMaxSize(),
          contentScale = ContentScale.FillBounds,
        )
        ringDrawable(data.recoveredToday)?.let { res ->
          Image(
            provider = ImageProvider(res),
            contentDescription = null,
            modifier = GlanceModifier.fillMaxSize(),
            contentScale = ContentScale.FillBounds,
          )
        }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Row(verticalAlignment = Alignment.Bottom) {
            Text("${data.recoveredToday}", style = textStyle(palette.textPrimary, 15.sp, bold = true, rtl = rtl))
            Text("/$DAILY_TARGET", style = textStyle(palette.textSecondary, 9.sp, bold = true, rtl = rtl))
          }
          Text(
            WidgetLabels.today(data.lang).uppercase(),
            style = textStyle(palette.accent, 6.sp, bold = true, rtl = rtl),
          )
        }
      }
      Spacer(GlanceModifier.width(12.dp))
      Column(modifier = GlanceModifier.defaultWeight(), verticalAlignment = Alignment.CenterVertically) {
        data.prayers.take(4).forEach { row ->
          PrayerRow(row, data.lang, palette, rtl, showTarget = false)
          Spacer(GlanceModifier.height(4.dp))
        }
      }
    }
    Spacer(GlanceModifier.height(8.dp))
    DailySegments(data.recoveredToday, data.lang, palette, rtl)
  }
}

@Composable
private fun LargeContent(data: WidgetData, palette: QadaaPalette, rtl: Boolean) {
  val journeyFraction =
    if (data.totalTarget > 0) min(1f, data.totalRecovered.toFloat() / data.totalTarget) else 0f
  val containerWidth = LocalSize.current.width
  Column {
    Row(modifier = GlanceModifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
      Text(WidgetLabels.appTitle(data.lang), style = textStyle(palette.accent, 12.sp, bold = true, rtl = rtl))
      Spacer(GlanceModifier.defaultWeight())
      if (data.streak > 0) {
        Text("🔥 ${data.streak}", style = textStyle(palette.flame, 10.sp, bold = true, rtl = rtl))
      }
    }
    Spacer(GlanceModifier.height(10.dp))
    Row(verticalAlignment = Alignment.CenterVertically) {
      Box(contentAlignment = Alignment.Center, modifier = GlanceModifier.size(64.dp)) {
        Image(
          provider = ImageProvider(R.drawable.widget_ring_track),
          contentDescription = null,
          modifier = GlanceModifier.fillMaxSize(),
          contentScale = ContentScale.FillBounds,
        )
        ringDrawable(data.recoveredToday)?.let { res ->
          Image(
            provider = ImageProvider(res),
            contentDescription = null,
            modifier = GlanceModifier.fillMaxSize(),
            contentScale = ContentScale.FillBounds,
          )
        }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
          Row(verticalAlignment = Alignment.Bottom) {
            Text("${data.recoveredToday}", style = textStyle(palette.textPrimary, 16.sp, bold = true, rtl = rtl))
            Text("/$DAILY_TARGET", style = textStyle(palette.textSecondary, 9.sp, bold = true, rtl = rtl))
          }
          Text(
            WidgetLabels.today(data.lang).uppercase(),
            style = textStyle(palette.accent, 6.sp, bold = true, rtl = rtl),
          )
        }
      }
      Spacer(GlanceModifier.width(14.dp))
      Column(modifier = GlanceModifier.defaultWeight()) {
        Row(verticalAlignment = Alignment.Bottom) {
          Text("${data.totalRecovered}", style = textStyle(palette.textPrimary, 17.sp, bold = true, rtl = rtl))
          Spacer(GlanceModifier.width(3.dp))
          Text("/ ${data.totalTarget}", style = textStyle(palette.textTertiary, 10.sp, bold = true, rtl = rtl))
        }
        Spacer(GlanceModifier.height(4.dp))
        Box(modifier = GlanceModifier.fillMaxWidth().height(5.dp)) {
          Box(
            modifier = GlanceModifier.fillMaxSize()
              .background(palette.track)
              .cornerRadius(3.dp),
          ) {}
          Box(
            modifier = GlanceModifier.width((containerWidth * journeyFraction).coerceAtLeast(6.dp))
              .fillMaxHeight()
              .background(palette.accentEnd)
              .cornerRadius(3.dp),
          ) {}
        }
      }
    }
    Spacer(GlanceModifier.height(10.dp))
    data.prayers.take(5).forEach { row ->
      PrayerRow(row, data.lang, palette, rtl, showTarget = true)
      Spacer(GlanceModifier.height(5.dp))
    }
    Spacer(GlanceModifier.height(8.dp))
    DailySegments(data.recoveredToday, data.lang, palette, rtl)
    if (data.hadith.isNotEmpty()) {
      Spacer(GlanceModifier.height(8.dp))
      Text(hadithText(data.hadith, rtl), style = textStyle(palette.textTertiary, 9.sp, rtl = rtl), maxLines = 2)
    }
  }
}

private fun hadithText(text: String, rtl: Boolean): String =
  if (rtl) "\u200F$text" else text
