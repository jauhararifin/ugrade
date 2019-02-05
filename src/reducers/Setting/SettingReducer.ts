import { Reducer } from "redux"

import { SettingState, initialState } from "./SettingState"
import { SettingActionType } from "./SettingAction"

export const settingReducer: Reducer<SettingState> = (state: SettingState = initialState, action): SettingState => {
    switch (action.type) {
        case SettingActionType.SetProxy:
            return {
                ...state,
                proxyHost: action.host,
                proxyPort: action.port,
                proxyUsername: action.username,
                proxyPassword: action.password,
            }
    }
    return state
}