export const SETTING_PROXY_HOST_KEY = 'setting.proxy.host'
export const SETTING_PROXY_PORT_KEY = 'setting.proxy.port'
export const SETTING_PROXY_USERNAME_KEY = 'setting.proxy.username'
export const SETTING_PROXY_PASSWORD_KEY = 'setting.proxy.password'

export interface ProxySetting {
  host: string
  port: number
  username: string
  password: string
}

export interface SettingState {
  proxy: ProxySetting
}

export const initialState: SettingState = {
  proxy: {
    host: localStorage.getItem(SETTING_PROXY_HOST_KEY) || '',
    port: Number(localStorage.getItem(SETTING_PROXY_PORT_KEY) || 0),
    username: localStorage.getItem(SETTING_PROXY_USERNAME_KEY) || '',
    password: localStorage.getItem(SETTING_PROXY_PASSWORD_KEY) || '',
  },
}
