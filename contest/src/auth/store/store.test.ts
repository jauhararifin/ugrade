import lodash from 'lodash'
import { InMemoryAuthStore } from './inmemory'
import { UserModel } from './model'
import { NoSuchUser } from './NoSuchUser'
import { AuthStore } from './store'

function testStore(generateStore: () => AuthStore) {
  let store: AuthStore = generateStore()

  beforeEach(() => {
    store = generateStore()
  })

  const user1: UserModel = {
    id: 'uid1',
    contestId: 'contestid1',
    username: 'uname1',
    email: 'email1',
    name: 'name1',
    permissions: [],
    password: 'password1',
    token: 'token1',
    signUpCode: 'signupcode1',
    resetPasswordCode: 'resetpasscode1',
  }

  const user2: UserModel = {
    id: 'uid2',
    contestId: 'contestid1',
    username: 'uname2',
    email: 'email2',
    name: 'name2',
    permissions: [],
    password: 'password2',
    token: 'token2',
    signUpCode: 'signupcode2',
    resetPasswordCode: 'resetpasscode2',
  }

  const user3: UserModel = {
    id: 'uid3',
    contestId: 'contestid2',
    username: 'uname3',
    email: 'email3',
    name: 'name3',
    permissions: [],
    password: 'password3',
    token: 'token3',
    signUpCode: 'signupcode3',
    resetPasswordCode: 'resetpasscode3',
  }

  test('can get by id after put', async () => {
    const putRes = await store.putUser(user1)
    expect(putRes).toEqual(user1)
    expect(putRes).not.toBe(user1)

    const getRes = await store.getUserById('uid1')
    expect(getRes).toEqual(user1)
    expect(getRes).not.toBe(user1)
  })

  test('can get by email after put', async () => {
    const putRes = await store.putUser(user1)
    expect(putRes).toEqual(user1)
    expect(putRes).not.toBe(user1)

    const getRes = await store.getUserByEmail('contestid1', 'email1')
    expect(getRes).toEqual(user1)
    expect(getRes).not.toBe(user1)
  })

  test('can get by username after put', async () => {
    const putRes = await store.putUser(user1)
    expect(putRes).toEqual(user1)
    expect(putRes).not.toBe(user1)

    const getRes = await store.getUserByUsername('contestid1', 'uname1')
    expect(getRes).toEqual(user1)
    expect(getRes).not.toBe(user1)
  })

  test('can get by token after put', async () => {
    const putRes = await store.putUser(user1)
    expect(putRes).toEqual(user1)
    expect(putRes).not.toBe(user1)

    const getRes = await store.getUserByToken('token1')
    expect(getRes).toEqual(user1)
    expect(getRes).not.toBe(user1)
  })

  test('can get by token after put', async () => {
    const putRes = await store.putUser(user1)
    expect(putRes).toEqual(user1)
    expect(putRes).not.toBe(user1)

    const getRes = await store.getUserByToken('token1')
    expect(getRes).toEqual(user1)
    expect(getRes).not.toBe(user1)
  })

  test("can update user's name when put twice", async () => {
    const putRes = await store.putUser(user1)
    expect(putRes).toEqual(user1)

    const updateUser = { ...user1, name: 'newname' }
    const updatedPut = await store.putUser(updateUser)
    expect(updatedPut).toEqual(updateUser)

    const getRes = await store.getUserById('uid1')
    expect(getRes).toEqual(updateUser)

    const getToken = await store.getUserByToken('token1')
    expect(getToken).toEqual(updateUser)

    const getEmail = await store.getUserByEmail('contestid1', 'email1')
    expect(getEmail).toEqual(updateUser)

    const getUname = await store.getUserByUsername('contestid1', 'uname1')
    expect(getUname).toEqual(updateUser)
  })

  test("can update user's token when put twice", async () => {
    const putRes = await store.putUser(user1)
    expect(putRes).toEqual(user1)

    const updateUser = { ...user1, token: 'somenewvalue' }
    const updatedPut = await store.putUser(updateUser)
    expect(updatedPut).toEqual(updateUser)

    const getRes = await store.getUserById('uid1')
    expect(getRes).toEqual(updateUser)

    const getToken = await store.getUserByToken('somenewvalue')
    expect(getToken).toEqual(updateUser)

    const getEmail = await store.getUserByEmail('contestid1', 'email1')
    expect(getEmail).toEqual(updateUser)

    const getUname = await store.getUserByUsername('contestid1', 'uname1')
    expect(getUname).toEqual(updateUser)
  })

  test('multiple user in one contest', async () => {
    const putRes1 = await store.putUser(user1)
    expect(putRes1).toEqual(user1)

    const putRes2 = await store.putUser(user2)
    expect(putRes2).toEqual(user2)

    const getRes1 = await store.getUserById('uid1')
    expect(getRes1).toEqual(user1)

    const getToken1 = await store.getUserByToken('token1')
    expect(getToken1).toEqual(user1)

    const getEmail1 = await store.getUserByEmail('contestid1', 'email1')
    expect(getEmail1).toEqual(user1)

    const getUname1 = await store.getUserByUsername('contestid1', 'uname1')
    expect(getUname1).toEqual(user1)

    const getRes2 = await store.getUserById('uid2')
    expect(getRes2).toEqual(user2)

    const getToken2 = await store.getUserByToken('token2')
    expect(getToken2).toEqual(user2)

    const getEmail2 = await store.getUserByEmail('contestid1', 'email2')
    expect(getEmail2).toEqual(user2)

    const getUname2 = await store.getUserByUsername('contestid1', 'uname2')
    expect(getUname2).toEqual(user2)
  })

  test('user in different contest', async () => {
    const putRes1 = await store.putUser(user1)
    expect(putRes1).toEqual(user1)

    const putRes3 = await store.putUser(user3)
    expect(putRes3).toEqual(user3)

    const getRes1 = await store.getUserById('uid1')
    expect(getRes1).toEqual(user1)

    const getToken1 = await store.getUserByToken('token1')
    expect(getToken1).toEqual(user1)

    const getEmail1 = await store.getUserByEmail('contestid1', 'email1')
    expect(getEmail1).toEqual(user1)

    const getUname1 = await store.getUserByUsername('contestid1', 'uname1')
    expect(getUname1).toEqual(user1)

    const getRes3 = await store.getUserById('uid3')
    expect(getRes3).toEqual(user3)

    const getToken3 = await store.getUserByToken('token3')
    expect(getToken3).toEqual(user3)

    const getEmail3 = await store.getUserByEmail('contestid2', 'email3')
    expect(getEmail3).toEqual(user3)

    const getUname3 = await store.getUserByUsername('contestid2', 'uname3')
    expect(getUname3).toEqual(user3)
  })

  test('ignore empty username', async () => {
    const userX = { ...user1, username: '' }
    const userY = { ...user2, username: '' }
    await store.putUser(userX)
    await store.putUser(userY)
    expect(store.getUserByUsername('contest1', '')).rejects.toThrow(
      new NoSuchUser('No Such User')
    )
  })

  test('ignore empty token', async () => {
    const userX = { ...user1, token: '' }
    const userY = { ...user2, token: '' }
    await store.putUser(userX)
    await store.putUser(userY)
    expect(store.getUserByToken('')).rejects.toThrow(
      new NoSuchUser('No Such User')
    )
  })

  test('throw no such user when no user found', async () => {
    await store.putUser(user1)

    const getUserByTokenTable = ['', 'notoken']
    for (const token of getUserByTokenTable) {
      expect(store.getUserByToken(token)).rejects.toThrow(
        new NoSuchUser('No Such User')
      )
    }

    const getUserByIdTable = ['', 'unknownid']
    for (const id of getUserByIdTable) {
      expect(store.getUserById(id)).rejects.toThrow(
        new NoSuchUser('No Such User')
      )
    }

    const getUserByEmailTable = [
      ['contestid1', 'noemail'],
      ['contestid1', ''],
      ['contestid2', 'noemail'],
      ['contestid2', 'email1'],
      ['contestid2', ''],
    ]
    for (const pair of getUserByEmailTable) {
      expect(store.getUserByEmail(pair[0], pair[1])).rejects.toThrow(
        new NoSuchUser('No Such User')
      )
    }

    const getUserByUsernameTable = [
      ['contestid1', 'nouname'],
      ['contestid1', ''],
      ['contestid2', 'nouname'],
      ['contestid2', 'uname1'],
      ['contestid2', ''],
    ]
    for (const pair of getUserByUsernameTable) {
      expect(store.getUserByUsername(pair[0], pair[1])).rejects.toThrow(
        new NoSuchUser('No Such User')
      )
    }
  })
}

describe('InMemoryAuthStore test', () => {
  testStore(() => new InMemoryAuthStore([]))
})
