import { User } from "./AuthState"

export enum AuthActionType {
    SetSignedIn = "AUTH_SET_SIGNED_IN",
    SetMe = "AUTH_SET_ME",
    SetSignedOut = "AUTH_SET_LOGOUT"
}

export interface AuthSetSignedIn {
    type: AuthActionType.SetSignedIn
    token: string,
    rememberMe: boolean,
}

export interface AuthSetMe {
    type: AuthActionType.SetMe
    me: User
}

export interface AuthSetSignedOut {
    type: AuthActionType.SetSignedOut
}

export type AuthAction = AuthSetSignedIn | AuthSetMe | AuthSetSignedOut

export const setSignedIn = (token: string, rememberMe: boolean = false): AuthSetSignedIn => ({
    type: AuthActionType.SetSignedIn,
    token,
    rememberMe
})

export const setMe = (me: User): AuthSetMe => ({ type: AuthActionType.SetMe, me })

export const setSignedOut = (): AuthSetSignedOut => ({ type: AuthActionType.SetSignedOut })