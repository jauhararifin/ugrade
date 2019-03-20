import { announcementServiceValidator } from './validator'

describe('test announcement service validator', () => {
  test.each([
    ['12345678901234567890123456789075', 'qwertyuiopasdfghjklzxcvbnmqwerty'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMJNSAIS', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
  ])('getContestAnnouncements %s %s should pass', async (token, contestId) => {
    await expect(announcementServiceValidator.getContestAnnouncements(token, contestId)).resolves.toBeDefined()
  })

  test.each([
    ['ka812mSIJD9aismdM0asdMASKJD09mas', ''],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', '-'],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', 'ka812mSIJD9ai)mdM0asdMASKJD09mas'],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', 'ka812mSIJD9ai)mdM0asdMASKJD09'],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', 'ka812mSIJD9ai)mdM0asdMASKJD09asda'],
    ['', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['-', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['ka812mSIJD9ai)mdM0asdMASKJD09mas', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['ka812mSIJD9ai)mdM0asdMASKJD09', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['ka812mSIJD9ai)mdM0asdMASKJD09asda', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['asdf', 'asdf'],
  ])('getContestAnnouncements %s %s should fail', async (token, contestId) => {
    const result = announcementServiceValidator.getContestAnnouncements(token, contestId)
    await expect(result).rejects.toBeDefined()
    await expect(result).rejects.toHaveProperty('errors')
  })

  test.each([
    ['QWERTYUIOPASDFGHJKLZXCVBNMJNSAIS', 'title', 'content'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMJNSAIS', 'a'.repeat(255), 'content'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMJNSAIS', 'title', 'a'.repeat(4 * 1024)],
  ])('createAnnouncement %s %s %s should resolved', async (token, title, content) => {
    const result = announcementServiceValidator.createAnnouncement(token, title, content)
    await expect(result).resolves.toBeDefined()
  })

  test.each([
    ['QWERTYUIOPASDFGHJKLZXCVBNMJNSAIS', '', 'content'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMJNSAIS', 'a'.repeat(256), 'content'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMJNSAIS', 'title', ''],
    ['QWERTYUIOPASDFGHJKLZXCVBNMJNSAIS', 'title', 'a'.repeat(4 * 1024 + 1)],
  ])('createAnnouncement %s %s %s should fail', async (token, title, content) => {
    const result = announcementServiceValidator.createAnnouncement(token, title, content)
    await expect(result).rejects.toBeDefined()
    await expect(result).rejects.toHaveProperty('errors')
  })

  test.each([
    ['12345678901234567890123456789075', 'qwertyuiopasdfghjklzxcvbnmqwerty'],
    ['QWERTYUIOPASDFGHJKLZXCVBNMJNSAIS', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
  ])('readAnnouncement %s %s should pass', async (token, announcementId) => {
    await expect(announcementServiceValidator.readAnnouncement(token, announcementId)).resolves.toBeDefined()
  })

  test.each([
    ['ka812mSIJD9aismdM0asdMASKJD09mas', ''],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', '-'],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', 'ka812mSIJD9ai)mdM0asdMASKJD09mas'],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', 'ka812mSIJD9ai)mdM0asdMASKJD09'],
    ['ka812mSIJD9aismdM0asdMASKJD09mas', 'ka812mSIJD9ai)mdM0asdMASKJD09asda'],
    ['', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['-', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['ka812mSIJD9ai)mdM0asdMASKJD09mas', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['ka812mSIJD9ai)mdM0asdMASKJD09', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['ka812mSIJD9ai)mdM0asdMASKJD09asda', 'ka812mSIJD9aismdM0asdMASKJD09mas'],
    ['asdf', 'asdf'],
  ])('readAnnouncement %s %s should fail', async (token, announcementId) => {
    const result = announcementServiceValidator.readAnnouncement(token, announcementId)
    await expect(result).rejects.toBeDefined()
    await expect(result).rejects.toHaveProperty('errors')
  })
})
