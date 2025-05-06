import { app, html, I18n, openQuickPick, SettingItem, SettingTab } from "@typora-community-plugin/core"
import type { Command } from "@typora-community-plugin/core/typings/command/command-manager"
import type TriggerPlugin from "./main"
import { TRIGGER_EVENTS } from "./trigger"




export class TriggerSettingTab extends SettingTab {

  get name() {
    return 'Trigger'
  }

  i18n = new I18n({
    resources: {
      'en': {
      },
      'zh-cn': {
      },
    }
  })

  constructor(private plugin: TriggerPlugin) {
    super()
  }

  show() {
    const { plugin } = this
    const { t } = this.i18n

    this.containerEl.innerHTML = ''

    Object.values(app.commands.commandMap)
      .forEach(cmd => this.renderTriggers(cmd))

    super.show()
  }

  renderTriggers(cmd: Command) {
    this.addSetting(setting => {
      setting.addName(cmd.title)

      const trigger = this.plugin.triggerManager.findTrigger(cmd.id)
      if (trigger) {
        this.renderTriggerTag(setting, trigger, cmd.id)
      }
      else {
        this.renderAddingTriggerButton(setting, cmd.id)
      }
    })
  }

  renderAddingTriggerButton(setting: SettingItem, command: string) {
    setting.addButton(btn => {
      btn.append(html`<span class="fa fa-plus"></span>`)
      btn.onclick = () => {
        openQuickPick(TRIGGER_EVENTS, { placeholder: 'Select a trigger to run command' })
          .then(res => {
            const trigger = res?.label
            this.plugin.triggerManager.bind(trigger!, command)
            this.plugin.settings.set('triggers', this.plugin.triggerManager.toJSON())

            btn.remove()
            this.renderTriggerTag(setting, trigger!, command)
          })
      }
    })
  }

  renderTriggerTag(setting: SettingItem, trigger: string, command: string) {
    setting.addRemovableTag(trigger!, () => {
      this.plugin.triggerManager.unbind(trigger!, command)
      this.plugin.settings.set('triggers', this.plugin.triggerManager.toJSON())
      this.renderAddingTriggerButton(setting, command)
    })
  }
}
