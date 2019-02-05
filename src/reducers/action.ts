import { RouterAction } from "connected-react-router"
import { TitleAction } from "./Title"
import { AuthAction } from "./Auth"

export type AppAction = TitleAction | RouterAction | AuthAction