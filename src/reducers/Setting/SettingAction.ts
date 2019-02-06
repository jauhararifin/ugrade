
export enum SettingActionType {
    SetProxy = 'SETTING_ACTION_TYPE_SET_PROXY'
}

export interface SettingSetProxy {
    type: SettingActionType.SetProxy
    host: string
    port: number
    username: string
    password: string
}

export function setProxy(host: string, port: string | number, username?: string, password?: string): SettingSetProxy {
    return {
        type: SettingActionType.SetProxy,
        host,
        port: Number(port),
        username: username ? username : '',
        password: password ? password : '',
    }
}

export type SettingAction = SettingSetProxy