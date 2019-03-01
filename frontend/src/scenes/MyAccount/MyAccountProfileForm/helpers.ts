import { GenderType, ShirtSizeType } from 'ugrade/stores/UserProfile'

export const genderToString = (gender?: GenderType): string => {
  return gender === GenderType.GENDER_TYPE_FEMALE ? 'Female' : 'Male'
}

export const shirtSizeToString = (shirtSize?: ShirtSizeType): string => {
  switch (shirtSize) {
    case ShirtSizeType.SHIRT_SIZE_TYPE_XS:
      return 'XS'
    case ShirtSizeType.SHIRT_SIZE_TYPE_S:
      return 'S'
    case ShirtSizeType.SHIRT_SIZE_TYPE_L:
      return 'L'
    case ShirtSizeType.SHIRT_SIZE_TYPE_XL:
      return 'XL'
    case ShirtSizeType.SHIRT_SIZE_TYPE_XXL:
      return 'XXL'
    default:
      return 'M'
  }
}

export const genderKeys = Object.keys(GenderType)
export const genderValues = genderKeys.map(k => GenderType[k as any])

export const shirtSizeKeys = Object.keys(ShirtSizeType)
export const shirtSizeValues = shirtSizeKeys.map(k => ShirtSizeType[k as any])
