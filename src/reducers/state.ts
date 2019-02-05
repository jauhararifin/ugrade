import { TitleState } from "./Title"
import { RouterState } from "connected-react-router";

export interface AppState {
    router: RouterState
    title: TitleState
}