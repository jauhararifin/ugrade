export enum GenderType {
  Male = 'Male',
  Female = 'Female',
}

export enum ShirtSizeType {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export interface ProfileModel {
  userId: string
  gender?: GenderType
  shirtSize?: ShirtSizeType
  address?: string
}
