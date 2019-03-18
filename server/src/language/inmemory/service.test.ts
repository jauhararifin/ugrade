import { ValidationError } from 'yup'
import { NoSuchLanguage } from '../NoSuchLanguage'
import { availableLanguages } from './fixture'
import { InMemoryLanguageService } from './service'

describe('test in memory language service', () => {
  test('test getAllLanguages', async () => {
    const service = new InMemoryLanguageService()
    const result = service.getAllLanguages()
    await expect(result).resolves.toEqual(availableLanguages)
    await expect(result).not.toBe(availableLanguages)
  })

  test.each([
    '12oi123o1i2u3m192',
    '   ',
    '12938123812382383802389123jsjfj-',
    'as*djaqismdSDMAam908asmd0A(MSD*)',
    '1234567890123456789012345678909821',
    '1234567890123456789012345678921',
  ])('test getLanguageById %s', async id => {
    const service = new InMemoryLanguageService()
    await expect(service.getLanguageById(id)).rejects.toBeInstanceOf(
      ValidationError
    )
  })

  test.each(availableLanguages)('test getLanguageById %j', async lang => {
    const service = new InMemoryLanguageService()
    const result = service.getLanguageById(lang.id)
    await expect(result).resolves.toEqual(lang)
    await expect(result).resolves.not.toBe(lang)
  })

  test.each([
    'asdjkasdjalskdjalsjmdklasjdlaasd',
    '912391231m23m123xKJDHS9231027896',
    '01293871293819371sjadkasjdkajdSA',
  ])('test getLanguageById %j', async id => {
    const service = new InMemoryLanguageService()
    const result = service.getLanguageById(id)
    await expect(result).rejects.toBeInstanceOf(NoSuchLanguage)
  })
})
