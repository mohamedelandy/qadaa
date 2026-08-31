import SwiftUI
import WidgetKit

// MARK: - Shared model

private struct QadaaData: Codable {
  var lang: String = "en"
  var totalRecovered: Int = 0
  var totalTarget: Int = 0
  var recoveredToday: Int = 0
  var todayComplete: Bool = false
  var streak: Int = 0
  var hadith: String = ""
  var prayers: [PrayerRow] = []

  struct PrayerRow: Codable {
    var key: String = ""
    var recovered: Int = 0
    var target: Int = 0
  }
}

private extension Color {
  init(hex: UInt32, opacity: Double = 1.0) {
    let alpha = (hex >> 24) & 0xFF
    self.init(
      .sRGB,
      red: Double((hex >> 16) & 0xFF) / 255.0,
      green: Double((hex >> 8) & 0xFF) / 255.0,
      blue: Double(hex & 0xFF) / 255.0,
      opacity: opacity * (alpha == 0 ? 1.0 : Double(alpha) / 255.0)
    )
  }
}

private let dailyTarget = 5

private struct QadaaPalette {
  let bgTop: Color
  let bgBottom: Color
  let glow: Color
  let accent: Color
  let accentStart: Color
  let accentEnd: Color
  let textPrimary: Color
  let textSecondary: Color
  let textTertiary: Color
  let flame: Color
  let track: Color
  let ringInner: Color

  static func resolve(_ scheme: ColorScheme) -> QadaaPalette {
    scheme == .dark ? dark : light
  }

  private static let dark = QadaaPalette(
    bgTop: Color(hex: 0x101A2E),
    bgBottom: Color(hex: 0x070E1A),
    glow: Color(hex: 0x59047857),
    accent: Color(hex: 0x34D399),
    accentStart: Color(hex: 0x047857),
    accentEnd: Color(hex: 0x34D399),
    textPrimary: Color(hex: 0xF1F5F9),
    textSecondary: Color(hex: 0x94A3B8),
    textTertiary: Color(hex: 0x475569),
    flame: Color(hex: 0xFBBF24),
    track: Color(hex: 0x2634D399),
    ringInner: Color(hex: 0x0C1626)
  )

  private static let light = QadaaPalette(
    bgTop: Color(hex: 0xFFFFFF),
    bgBottom: Color(hex: 0xF0FDF4),
    glow: Color(hex: 0x1A047857),
    accent: Color(hex: 0x047857),
    accentStart: Color(hex: 0x047857),
    accentEnd: Color(hex: 0x34D399),
    textPrimary: Color(hex: 0x0F172A),
    textSecondary: Color(hex: 0x475569),
    textTertiary: Color(hex: 0x94A3B8),
    flame: Color(hex: 0xD97706),
    track: Color(hex: 0x1F047857),
    ringInner: Color(hex: 0xFFFFFF)
  )
}

private struct WidgetBackground: View {
  let palette: QadaaPalette

  var body: some View {
    ZStack {
      LinearGradient(colors: [palette.bgTop, palette.bgBottom], startPoint: .top, endPoint: .bottom)
      RadialGradient(colors: [palette.glow, .clear], center: .topTrailing, startRadius: 0, endRadius: 200)
    }
  }
}

private struct ProgressRing: View {
  let progress: Double
  let palette: QadaaPalette
  var lineWidth: CGFloat = 7

  var body: some View {
    let clamped = min(max(progress, 0.001), 1)
    ZStack {
      Circle().stroke(palette.track, style: StrokeStyle(lineWidth: lineWidth, lineCap: .round))
      if progress >= 1 {
        Circle()
          .stroke(
            LinearGradient(colors: [palette.accentStart, palette.accentEnd], startPoint: .topLeading, endPoint: .bottomTrailing),
            style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
          )
      } else {
        Circle()
          .trim(from: 0, to: clamped)
          .stroke(
            AngularGradient(colors: [palette.accentStart, palette.accentEnd], center: .center, startAngle: .degrees(0), endAngle: .degrees(360 * clamped)),
            style: StrokeStyle(lineWidth: lineWidth, lineCap: .round)
          )
          .rotationEffect(.degrees(-90))
      }
    }
  }
}

private struct RingCenter: View {
  let data: QadaaData
  let palette: QadaaPalette
  var valueFont: Font
  var showsToday: Bool = true

  var body: some View {
    VStack(spacing: 1) {
      HStack(alignment: .firstTextBaseline, spacing: 1) {
        Text("\(data.recoveredToday)")
          .font(valueFont)
          .foregroundColor(palette.textPrimary)
          .monospacedDigit()
        Text("/\(dailyTarget)")
          .font(.system(size: 9, weight: .semibold, design: .rounded))
          .foregroundColor(palette.textSecondary)
          .monospacedDigit()
      }
      if data.todayComplete {
        Image(systemName: "checkmark.seal.fill")
          .font(.caption2)
          .foregroundColor(palette.accent)
      } else if showsToday {
        Text(QadaaText.today(data.lang).uppercased())
          .font(.system(size: 7.5, weight: .bold))
          .kerning(0.8)
          .foregroundColor(palette.accent)
      }
    }
  }
}

private enum QadaaText {
  static func today(_ lang: String) -> String { lang == "ar" ? "اليوم" : "Today" }
  static func total(_ lang: String) -> String { lang == "ar" ? "الإجمالي" : "Total" }
  static func streak(_ lang: String) -> String { lang == "ar" ? "سلسلة الأيام" : "Day streak" }
  static func appTitle(_ lang: String) -> String { lang == "ar" ? "قضاء" : "Qadaa" }

  static func prayer(_ key: String, _ lang: String) -> String {
    switch key {
    case "fajr": return lang == "ar" ? "الفجر" : "Fajr"
    case "dhuhr": return lang == "ar" ? "الظهر" : "Dhuhr"
    case "asr": return lang == "ar" ? "العصر" : "Asr"
    case "maghrib": return lang == "ar" ? "المغرب" : "Maghrib"
    case "isha": return lang == "ar" ? "العشاء" : "Isha"
    default: return key
    }
  }
}

// MARK: - Provider

private struct QadaaProvider: TimelineProvider {
  private let appGroupID = "group.com.melnady.qadaa"
  private let dataKey = "widget_data"

  func placeholder(in context: Context) -> QadaaEntry {
    QadaaEntry(
      date: .now,
      data: QadaaData(
        totalRecovered: 5,
        recoveredToday: 2,
        prayers: [.init(key: "fajr", recovered: 1, target: 5)]
      )
    )
  }

  func getSnapshot(in context: Context, completion: @escaping (QadaaEntry) -> Void) {
    completion(QadaaEntry(date: .now, data: loadData()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<QadaaEntry>) -> Void) {
    let entry = QadaaEntry(date: .now, data: loadData())
    let nextRefresh = Calendar.current.date(byAdding: .minute, value: 15, to: .now) ?? .now
    completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
  }

  private func loadData() -> QadaaData {
    guard
      let defaults = UserDefaults(suiteName: appGroupID),
      let json = defaults.string(forKey: dataKey),
      let data = json.data(using: .utf8),
      let decoded = try? JSONDecoder().decode(QadaaData.self, from: data)
    else { return QadaaData() }
    return decoded
  }
}

private struct QadaaEntry: TimelineEntry {
  let date: Date
  let data: QadaaData
}

// MARK: - Views

private struct QadaaWidgetView: View {
  @Environment(\.widgetFamily) private var family
  @Environment(\.colorScheme) private var scheme
  let data: QadaaData

  var body: some View {
    Group {
      switch family {
      case .systemSmall:
        SmallContent(data: data)
      case .systemMedium:
        MediumContent(data: data)
      case .accessoryCircular:
        AccessoryCircularContent(data: data)
      case .accessoryRectangular:
        AccessoryRectangularContent(data: data)
      default:
        LargeContent(data: data)
      }
    }
    .environment(\.layoutDirection, data.lang == "ar" ? .rightToLeft : .leftToRight)
    .containerBackground(for: .widget) {
      if family == .accessoryCircular || family == .accessoryRectangular {
        Color.clear
      } else {
        WidgetBackground(palette: QadaaPalette.resolve(scheme))
      }
    }
  }
}

private struct SmallContent: View {
  let data: QadaaData
  @Environment(\.colorScheme) private var scheme

  var body: some View {
    let palette = QadaaPalette.resolve(scheme)
    VStack(spacing: 6) {
      Spacer(minLength: 0)
      ZStack {
        ProgressRing(
          progress: Double(data.recoveredToday) / Double(dailyTarget),
          palette: palette
        )
        .padding(4)
        RingCenter(data: data, palette: palette, valueFont: .system(size: 20, weight: .bold, design: .rounded))
      }
      .frame(maxWidth: .infinity)
      .aspectRatio(1, contentMode: .fit)
      Spacer(minLength: 0)
      VStack(spacing: 2) {
        Text("\(data.totalRecovered) / \(data.totalTarget)")
          .font(.caption2.weight(.semibold))
          .foregroundColor(palette.textSecondary)
          .monospacedDigit()
        if data.streak > 0 {
          Label("\(data.streak)", systemImage: "flame.fill")
            .font(.caption2.weight(.bold))
            .foregroundColor(palette.flame)
            .monospacedDigit()
        }
      }
    }
    .padding(.horizontal, 4)
  }
}

private struct PrayerRowView: View {
  let row: QadaaData.PrayerRow
  let lang: String
  let palette: QadaaPalette
  let showTarget: Bool

  var body: some View {
    let target = max(1, row.target)
    let done = row.target > 0 && row.recovered >= row.target
    HStack(spacing: 7) {
      Text(QadaaText.prayer(row.key, lang))
        .font(.caption2)
        .foregroundColor(palette.textSecondary)
        .lineLimit(1)
        .frame(width: 46, alignment: .leading)
      GeometryReader { geo in
        ZStack(alignment: .leading) {
          Capsule().fill(palette.track)
          Capsule()
            .fill(LinearGradient(colors: [palette.accentStart, palette.accentEnd], startPoint: .leading, endPoint: .trailing))
            .frame(width: geo.size.width * min(1, Double(row.recovered) / Double(target)))
        }
      }
      .frame(height: 4)
      Text(done ? "✓" : (showTarget ? "\(row.recovered)/\(row.target)" : "\(row.recovered)"))
        .font(.caption2.weight(done ? .bold : .semibold))
        .foregroundColor(done ? palette.accent : palette.textPrimary)
        .monospacedDigit()
        .frame(width: showTarget ? 38 : 16, alignment: .trailing)
    }
  }
}

private struct DailySegments: View {
  let filled: Int
  let palette: QadaaPalette

  var body: some View {
    HStack(spacing: 3) {
      ForEach(0..<dailyTarget, id: \.self) { i in
        Capsule()
          .fill(
            i < filled
              ? AnyShapeStyle(LinearGradient(colors: [palette.accentStart, palette.accentEnd], startPoint: .leading, endPoint: .trailing))
              : AnyShapeStyle(palette.track)
          )
          .frame(height: 5)
      }
    }
  }
}

private struct AccessoryCircularContent: View {
  let data: QadaaData

  private var palette: QadaaPalette {
    QadaaPalette(
      bgTop: .clear, bgBottom: .clear, glow: .clear,
      accent: .primary, accentStart: .primary, accentEnd: .primary,
      textPrimary: .primary, textSecondary: .secondary, textTertiary: .secondary,
      flame: .orange, track: .clear, ringInner: .clear
    )
  }

  var body: some View {
    let progress = Double(data.recoveredToday) / Double(dailyTarget)
    ZStack {
      Circle().stroke(Color.secondary.opacity(0.4), lineWidth: 3)
      if progress >= 1 {
        Circle().stroke(Color.primary, style: StrokeStyle(lineWidth: 3, lineCap: .round))
      } else {
        Circle()
          .trim(from: 0, to: max(progress, 0.001))
          .stroke(Color.primary, style: StrokeStyle(lineWidth: 3, lineCap: .round))
          .rotationEffect(.degrees(-90))
      }
      RingCenter(data: data, palette: palette, valueFont: .system(size: 13, weight: .bold, design: .rounded))
    }
    .containerBackground(for: .widget) { Color.clear }
  }
}

private struct AccessoryRectangularContent: View {
  let data: QadaaData

  private var progress: Double {
    Double(data.recoveredToday) / Double(dailyTarget)
  }

  var body: some View {
    VStack(alignment: .leading, spacing: 3) {
      HStack(spacing: 4) {
        Text(QadaaText.appTitle(data.lang))
          .font(.headline)
          .foregroundColor(.secondary)
        Spacer(minLength: 0)
        Text("\(data.recoveredToday)/\(dailyTarget)")
          .font(.subheadline.weight(.bold))
          .monospacedDigit()
      }
      GeometryReader { geo in
        ZStack(alignment: .leading) {
          Capsule().fill(Color.secondary.opacity(0.35))
          Capsule().fill(Color.primary).frame(width: geo.size.width * progress)
        }
      }
      .frame(height: 3.5)
      HStack(spacing: 4) {
        Text("\(data.totalRecovered) / \(data.totalTarget)")
          .font(.caption2)
          .foregroundColor(.secondary)
          .monospacedDigit()
        Spacer(minLength: 0)
        if data.streak > 0 {
          Label("\(data.streak)", systemImage: "flame.fill")
            .font(.caption2.weight(.bold))
            .foregroundColor(.orange)
            .monospacedDigit()
        }
      }
    }
    .containerBackground(for: .widget) { Color.clear }
  }
}

private struct MediumContent: View {
  let data: QadaaData
  @Environment(\.colorScheme) private var scheme

  var body: some View {
    let palette = QadaaPalette.resolve(scheme)
    VStack(spacing: 8) {
      HStack(spacing: 6) {
        Text(QadaaText.appTitle(data.lang))
          .font(.system(size: 11, weight: .heavy))
          .foregroundColor(palette.accent)
        Spacer(minLength: 0)
        Text("\(data.totalRecovered) / \(data.totalTarget)")
          .font(.caption2.weight(.semibold))
          .foregroundColor(palette.textSecondary)
          .monospacedDigit()
        if data.streak > 0 {
          Label("\(data.streak)", systemImage: "flame.fill")
            .font(.caption2.weight(.bold))
            .foregroundColor(palette.flame)
            .monospacedDigit()
        }
      }
      HStack(spacing: 12) {
        ZStack {
          ProgressRing(progress: Double(data.recoveredToday) / Double(dailyTarget), palette: palette, lineWidth: 6)
            .padding(2)
          RingCenter(data: data, palette: palette, valueFont: .system(size: 15, weight: .bold, design: .rounded), showsToday: false)
        }
        .frame(width: 58, height: 58)
        VStack(spacing: 5) {
          ForEach(data.prayers.prefix(4), id: \.key) { row in
            PrayerRowView(row: row, lang: data.lang, palette: palette, showTarget: false)
          }
        }
      }
      HStack(spacing: 6) {
        Text(QadaaText.today(data.lang).uppercased())
          .font(.system(size: 8, weight: .bold))
          .kerning(0.8)
          .foregroundColor(palette.accent)
        DailySegments(filled: data.recoveredToday, palette: palette)
      }
    }
  }
}

private struct LargeContent: View {
  let data: QadaaData
  @Environment(\.colorScheme) private var scheme

  private var journeyFraction: Double {
    data.totalTarget > 0 ? min(1, Double(data.totalRecovered) / Double(data.totalTarget)) : 0
  }

  var body: some View {
    let palette = QadaaPalette.resolve(scheme)
    VStack(alignment: .leading, spacing: 10) {
      HStack(spacing: 6) {
        Text(QadaaText.appTitle(data.lang))
          .font(.system(size: 12, weight: .heavy))
          .foregroundColor(palette.accent)
        Spacer(minLength: 0)
        if data.streak > 0 {
          Label("\(data.streak)", systemImage: "flame.fill")
            .font(.caption.weight(.bold))
            .foregroundColor(palette.flame)
            .monospacedDigit()
        }
      }
      HStack(spacing: 14) {
        ZStack {
          ProgressRing(progress: Double(data.recoveredToday) / Double(dailyTarget), palette: palette)
            .padding(2)
          RingCenter(data: data, palette: palette, valueFont: .system(size: 16, weight: .bold, design: .rounded), showsToday: false)
        }
        .frame(width: 64, height: 64)
        VStack(alignment: .leading, spacing: 4) {
          HStack(alignment: .firstTextBaseline, spacing: 3) {
            Text("\(data.totalRecovered)")
              .font(.system(size: 17, weight: .bold, design: .rounded))
              .foregroundColor(palette.textPrimary)
              .monospacedDigit()
            Text("/ \(data.totalTarget)")
              .font(.caption2.weight(.semibold))
              .foregroundColor(palette.textTertiary)
              .monospacedDigit()
          }
          GeometryReader { geo in
            ZStack(alignment: .leading) {
              Capsule().fill(palette.track)
              Capsule()
                .fill(LinearGradient(colors: [palette.accentStart, palette.accentEnd], startPoint: .leading, endPoint: .trailing))
                .frame(width: geo.size.width * journeyFraction)
            }
          }
          .frame(height: 5)
        }
      }
      VStack(spacing: 7) {
        ForEach(data.prayers.prefix(5), id: \.key) { row in
          PrayerRowView(row: row, lang: data.lang, palette: palette, showTarget: true)
        }
      }
      DailySegments(filled: data.recoveredToday, palette: palette)
      Spacer(minLength: 0)
      if !data.hadith.isEmpty {
        Text(data.hadith)
          .font(.caption2)
          .italic()
          .foregroundColor(palette.textTertiary)
          .lineLimit(2)
      }
    }
  }
}

// MARK: - Widget

@main
struct QadaaWidgetBundle: WidgetBundle {
  var body: some Widget {
    QadaaHomeWidget()
  }
}

struct QadaaHomeWidget: Widget {
  let kind = "QadaaWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: QadaaProvider()) { entry in
      QadaaWidgetView(data: entry.data)
    }
    .configurationDisplayName("قضاء")
    .description("Track your recovered prayers at a glance.")
    .supportedFamilies([.systemSmall, .systemMedium, .systemLarge, .accessoryCircular, .accessoryRectangular])
  }
}
