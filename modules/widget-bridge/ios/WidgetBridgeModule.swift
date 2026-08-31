import ExpoModulesCore
import WidgetKit

public class WidgetBridgeModule: Module {
  private static let appGroupID = "group.com.melnady.qadaa"
  private static let dataKey = "widget_data"

  public func definition() -> ModuleDefinition {
    Name("WidgetBridge")

    AsyncFunction("setData") { (jsonString: String) in
      guard let defaults = UserDefaults(suiteName: Self.appGroupID) else { return }
      defaults.set(jsonString, forKey: Self.dataKey)
    }

    AsyncFunction("reloadAllTimelines") {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }
}
