package expo.modules.widgetbridge

/**
 * Expo module bridging JS state into Android widget storage (SharedPreferences
 * `qadaa_widget`/`widget_data`) and broadcasting an update to all placed
 * Qadaa widgets. API constraint: expo-modules-kotlin `Module` exposes no bare
 * `context` (only `appContext`), and `AppContext.reactContext` is nullable —
 * setData bails out silently when unavailable.
 */
import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WidgetBridgeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WidgetBridge")

    AsyncFunction("setData") { jsonString: String ->
      val ctx = appContext.reactContext ?: return@AsyncFunction
      val prefs = ctx.getSharedPreferences("qadaa_widget", Context.MODE_PRIVATE)
      prefs.edit().putString("widget_data", jsonString).apply()

      val manager = AppWidgetManager.getInstance(ctx)
      val receiver = ComponentName(ctx, QadaaWidgetReceiver::class.java)
      val ids = manager.getAppWidgetIds(receiver)
      if (ids.isNotEmpty()) {
        ctx.sendBroadcast(
          Intent(ctx, QadaaWidgetReceiver::class.java).apply {
            action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
          }
        )
      }
    }
  }
}
