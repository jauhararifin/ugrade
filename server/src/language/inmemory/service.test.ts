import { availableLanguages } from './fixture'
import { InMemoryLanguageService } from './service'

describe('test in memory language service', () => {
  //   getAllLanguages
  //   getLanguageById

  test('test getAllLanguages', () => {
    const service = new InMemoryLanguageService()
    const result = service.getAllLanguages()
    expect(result).resolves.toEqual(availableLanguages)
    expect(result).not.toBe(availableLanguages)
  })

  test.each(availableLanguages)('test getLanguageById %j', lang => {
    const service = new InMemoryLanguageService()
    const result = service.getLanguageById(lang.id)
    expect(result).resolves.toEqual(lang)
    expect(result).not.toBe(lang)
  })
})
