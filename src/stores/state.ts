import { RouterState } from "connected-react-router"

import { TitleState } from "./Title"
import { AuthState } from "./Auth"
import { SettingState } from "./Setting"
import { ServerStatusState } from "./ServerStatus"
import { ContestState } from "./Contest"

export interface AppState {
    router: RouterState
    title: TitleState
    auth: AuthState
    setting: SettingState
    server: ServerStatusState
    contest: ContestState
}