import { RouterState } from "connected-react-router"

import { TitleState } from "./Title"
import { AuthState } from "./Auth"

export interface AppState {
    router: RouterState
    title: TitleState
    auth: AuthState
}