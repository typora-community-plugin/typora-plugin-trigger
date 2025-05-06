import { Plugin, PluginSettings } from '@typora-community-plugin/core'
import { DEFAULT_SETTINGS, type TriggerSettings } from './settings'
import { TriggerSettingTab } from './setting-tab'
import { TriggerManager } from './trigger'


export default class extends Plugin<TriggerSettings> {

  triggerManager = new TriggerManager()

  onload() {
    const { app } = this

    this.registerSettings(
      new PluginSettings(app, this.manifest, {
        version: 1,
      }))

    this.settings.setDefault(DEFAULT_SETTINGS)

    this.settings.get('triggers').forEach(t => {
      this.triggerManager.bind(t.trigger, t.command)
    })

    this.registerSettingTab(new TriggerSettingTab(this))
  }

  onunload() {
    this.settings.get('triggers').forEach(t => {
      this.triggerManager.unbind(t.trigger, t.command)
    })
  }
}
