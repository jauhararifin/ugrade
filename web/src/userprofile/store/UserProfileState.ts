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

export interface UserProfile {
  gender?: GenderType
  shirtSize?: ShirtSizeType
  address?: string
}

export type UserProfileState = UserProfile

export const initialState: UserProfileState = {}
