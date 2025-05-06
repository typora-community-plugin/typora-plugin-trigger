import { app, Events } from "@typora-community-plugin/core"
import type { DisposeFunc } from "@typora-community-plugin/core/typings/utils/types"
import type { TriggerConfigItem } from "./settings"


export const TRIGGERS = [
  { scope: 'App', instance: app },
  { scope: 'Config', instance: app.config },
  { scope: 'MarkdownEditor', instance: app.features.markdownEditor },
  { scope: 'Vault', instance: app.vault },
  { scope: 'Workspace', instance: app.workspace },
]

export const TRIGGER_EVENTS = TRIGGERS.map(t => t.instance.getEventNames().map(e => `${t.scope} @${e}`))
  .reduce((t, flated) => [...flated, ...t])
  .map(e => ({ label: e }))


type TriggerItem = TriggerConfigItem & { _dispose: DisposeFunc }

export class TriggerManager {

  private triggers: Record<string, TriggerItem> = {}

  bind(trigger: string, command: string) {
    const id = this.getTriggerId(trigger, command)
    const [scope, event] = trigger.split(' @') ?? ['', '']
    const instance = TRIGGERS.find(t => t.scope === scope)?.instance as Events<any>
    this.triggers[id] = {
      trigger,
      command,
      _dispose: instance.on(event, () => app.commands.run(command)),
    }
  }

  unbind(trigger: string, command: string) {
    const id = this.getTriggerId(trigger, command)
    this.triggers[id]._dispose()
    delete this.triggers[id]
  }

  private getTriggerId(trigger: string, command: string) {
    return `${trigger} ${command}`
  }

  findTrigger(command: string) {
    return Object.keys(this.triggers)
      .find(k => k.endsWith(command))
      ?.slice(0, -(command.length + 1))
  }

  fromJSON(data: TriggerConfigItem[]) {
    this.triggers = data.reduce((o, t) => {
      o[t.trigger] = { ...t, _dispose: Function }
      return o
    }, {} as Record<string, TriggerItem>)
  }

  toJSON() {
    return Object.values(this.triggers)
  }

}
