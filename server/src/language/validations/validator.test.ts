import { ValidationError } from 'yup'
import { languageServiceValidator } from './validator'

describe('language module validator', () => {
  test.each([
    'SoMe4lPh109sad129M12Mmda01234567',
    '12345678901234567890123456789082',
    'qwertyuiopasdfghjklzxcvbnmjauvna',
    'UIQHWOIEVQOJQOMWJDNQOWJDKCJQFQWQ',
  ])('using %s as language id should resolved', langId => {
    expect(
      languageServiceValidator.getLanguageById(
        'SoMe4lPh109sad129M12Mmda01234567'
      )
    ).resolves.toBeDefined()
  })

  test.each([
    'SoMe4lPh109sad122Mmda01234567',
    '123456789012345678901234567890*2',
    '                                ',
    'SoMe4lPh109sad122Mmda012asdfasdfa34567',
  ])('using %s as language id should rejected', async () => {
    try {
      await languageServiceValidator.getLanguageById(
        'SoMe4lPh109sad122Mmda01234567'
      )
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.errors).toBeDefined()
    }
  })
})
