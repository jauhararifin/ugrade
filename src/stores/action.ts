import { RouterAction } from "connected-react-router"
import { TitleAction } from "./Title"
import { AuthAction } from "./Auth"
import { SettingAction } from "./Setting"
import { ServerStatusAction } from "./ServerStatus"
import { ContestAction } from "./Contest"

export type AppAction = TitleAction | RouterAction | AuthAction | SettingAction | ServerStatusAction | ContestAction