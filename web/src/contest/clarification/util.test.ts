import { normalizeClarification } from "./util"

describe('contest clarification util', () => {
  test('normalizeClarification', () => {
    const now = new Date()
    const serviceClarif = {
      id: 'id',
      title: 'title',
      subject: 'subject',
      issuedTime: now,
      entries: []
    }
    expect(normalizeClarification(serviceClarif)).toEqual({
      id: 'id',
      title: 'title',
      subject: 'subject',
      issuedTime: now,
      entries: {}
    })
  })
})