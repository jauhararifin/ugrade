import { ValidationError } from 'yup'
import { profileServiceValidator } from './validator'

describe('test profile service validator', () => {
  test.each([
    ['78978987656789876787654454345676', '12345678901234567890078987678987'],
    ['qwertyuiopasdfghjklzxcvbnmqwerty', 'qwertyuioplkjhgfdsazxcvbnmpoiuqh'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMQWERTY', 'QWERTYUIOPLKJHGFDSAZXCVBNMPOIUQH'],
    ['IOPAaskKa870ajLau80aALaJAD70123L', 'KansfiAKCMja91930Jd1jD19283JLASD'],
  ])('getUserProfile %j', async (token, userId) => {
    await expect(profileServiceValidator.getUserProfile(token, userId)).resolves.toBeDefined()
  })

  test.each([
    ['78978987656789876787654454345676', '1234567890123456789007898767898-'],
    ['7897898765678987678765445434567-', '1234567890123456789007898767898-'],
    ['789--7898765678987678765444-5676', '-12345678901234567890078987678987'],
    ['qwertyuiopasdfghjklzxcvbnmqwerty', 'qwertyuioplkjhgfdsazxcvbnmpoiuqh-'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMQWERTASJDY', 'QRTYUIOPLKJHGFDSAZXCVBNMPOIUQH'],
    ['IOPAaskKa870ajLau80aALaJAD70123L.', 'KansfiAKCMja91930Jd1jD19283JLASD'],
  ])('getUserProfile %j should fail', async (token, userId) => {
    const result = profileServiceValidator.getUserProfile(token, userId)
    await expect(result).rejects.toBeInstanceOf(ValidationError)
    await expect(result).rejects.toHaveProperty('errors')
  })

  test.each([
    ['78978987656789876787654454345676', ''],
    ['12345678901234567890078987678987', undefined],
    ['qwertyuiopasdfghjklzxcvbnmqwerty', 'someaddress'],
    ['qwertyuioplkjhgfdsazxcvbnmpoiuqh', '1poj2em  i(S*D <script></script>'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMQWERTY', 'aksdjl'],
    ['QWERTYUIOPLKJHGFDSAZXCVBNMPOIUQH', ')E_!(@#_!)@('],
    ['IOPAaskKa870ajLau80aALaJAD70123L', 'a'.repeat(255)],
    ['KansfiAKCMja91930Jd1jD19283JLASD', 'a'],
  ])('setMyProfile %j', async (token, address) => {
    await expect(profileServiceValidator.setMyProfile(token, undefined, undefined, address)).resolves.toBeDefined()
  })

  test.each([
    ['78978987656789876787654454345676', 'a'.repeat(256)],
    ['1234567890123456789007898767898-', '-'],
    ['7897898765678987678765445434567-', '-'],
    ['1234567890123456789007898767898-', '-'],
    ['789--7898765678987678765444-5676', '-'],
    ['-12345678901234567890078987678987', '-'],
    ['qwertyuiopasdfghjklzxcvbnmqwerty', 'a'.repeat(300)],
    ['qwertyuioplkjhgfdsazxcvbnmpoiuqh-', '-'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMQWERTASJDY', '-'],
    ['QRTYUIOPLKJHGFDSAZXCVBNMPOIUQH', '-'],
    ['IOPAaskKa870ajLau80aALaJAD70123L.', '-'],
    ['KansfiAKCMja91930Jd1jD19283JLASD', '-'.repeat(256)],
  ])('setMyProfile %j should fail', async (token, address) => {
    const result = profileServiceValidator.setMyProfile(token, undefined, undefined, address)
    await expect(result).rejects.toBeInstanceOf(ValidationError)
    await expect(result).rejects.toHaveProperty('errors')
  })
})
