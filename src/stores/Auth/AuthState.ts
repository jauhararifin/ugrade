export const AUTH_IS_SIGNED_IN_KEY = 'auth.isSignedIn'
export const AUTH_TOKEN_KEY = 'auth.token'
export const AUTH_REMEMBER_ME_KEY = 'auth.rememberMe'

export enum GenderType {
  GENDER_TYPE_MALE = 'Male',
  GENDER_TYPE_FEMALE = 'Female',
}

export enum ShirtSizeType {
  SHIRT_SIZE_TYPE_XS = 'XS',
  SHIRT_SIZE_TYPE_S = 'S',
  SHIRT_SIZE_TYPE_M = 'M',
  SHIRT_SIZE_TYPE_L = 'L',
  SHIRT_SIZE_TYPE_XL = 'XL',
  SHIRT_SIZE_TYPE_XXL = 'XXL',
}

export interface User {
  username: string
  name: string
  email: string

  gender?: GenderType
  address?: string
  shirtSize?: ShirtSizeType
}

export interface AuthState {
  isSignedIn: boolean
  token: string
  rememberMe: boolean
  me?: User
}

export const initialState: AuthState = {
  isSignedIn:
    (sessionStorage.getItem(AUTH_IS_SIGNED_IN_KEY) ||
      localStorage.getItem(AUTH_IS_SIGNED_IN_KEY)) === 'true',
  token:
    sessionStorage.getItem(AUTH_TOKEN_KEY) ||
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    '',
  rememberMe:
    (sessionStorage.getItem(AUTH_REMEMBER_ME_KEY) ||
      localStorage.getItem(AUTH_REMEMBER_ME_KEY)) === 'true',
}
