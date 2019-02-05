export interface SettingState {
    proxyHost: string
    proxyPort: number
    proxyUsername: string
    proxyPassword: string
}

export const initialState: SettingState = {
    proxyHost: '',
    proxyPort: 0,
    proxyUsername: '',
    proxyPassword: '',
}