export const SETTING_PROXY_HOST_KEY = 'setting.proxy.host'
export const SETTING_PROXY_PORT_KEY = 'setting.proxy.port'
export const SETTING_PROXY_USERNAME_KEY = 'setting.proxy.username'
export const SETTING_PROXY_PASSWORD_KEY = 'setting.proxy.password'

export interface SettingState {
    proxyHost: string
    proxyPort: number
    proxyUsername: string
    proxyPassword: string
}

export const initialState: SettingState = {
    proxyHost: localStorage.getItem(SETTING_PROXY_HOST_KEY) || '',
    proxyPort: Number(localStorage.getItem(SETTING_PROXY_PORT_KEY) || 0),
    proxyUsername: localStorage.getItem(SETTING_PROXY_USERNAME_KEY) || '',
    proxyPassword: localStorage.getItem(SETTING_PROXY_PASSWORD_KEY) || '',
}