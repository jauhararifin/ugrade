import lodash from 'lodash'
import { announcements } from './fixture'
describe('test fixture validity', () => {
  test('id should unique and valid', () => {
    expect(lodash.uniq(announcements.map(a => a.id)).length).toEqual(
      announcements.length
    )
    announcements
      .map(a => a.id)
      .forEach(id => expect(id).toMatch(/^[a-zA-Z0-9]{32}$/))
  })
})
