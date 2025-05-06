export type TriggerConfigItem = { trigger: string, command: string }

export interface TriggerSettings {
  triggers: TriggerConfigItem[]
}

export const DEFAULT_SETTINGS: TriggerSettings = {
  triggers: [],
}
