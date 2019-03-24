import { hashSync } from 'bcrypt-nodejs'
import { ContestArkav4Final, ContestArkav4Qual, ContestArkav5Final, ContestArkav5Qual } from 'ugrade/contest/inmemory'
import { Permission, User } from '../user'

export const adminPermissions = [
  Permission.InfoUpdate,
  Permission.AnnouncementCreate,
  Permission.AnnouncementRead,

  Permission.ProblemsCreate,
  Permission.ProblemsRead,
  Permission.ProblemsReadDisabled,
  Permission.ProblemsUpdate,
  Permission.ProblemsDelete,

  Permission.UsersInvite,
  Permission.UsersPermissionsUpdate,
  Permission.UsersDelete,

  Permission.ProfilesRead,
]

export const contestantPermissions = [Permission.AnnouncementRead, Permission.ProblemsRead]

function padTo32(s: string): string {
  return '0'.repeat(32 - s.length) + s
}

export const UserTest1: User = {
  id: padTo32('1'),
  contestId: ContestArkav4Qual.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
  password: hashSync('testtest'),
  token: '',
}

export const UserNewTest1: User = {
  id: padTo32('2'),
  contestId: ContestArkav4Qual.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
  password: hashSync('newtesttest'),
  token: '',
}

export const UserTest2: User = {
  id: padTo32('3'),
  contestId: ContestArkav4Final.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
  password: hashSync('testtest'),
  token: '',
}

export const UserNewTest2: User = {
  id: padTo32('4'),
  contestId: ContestArkav4Final.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
  password: hashSync('newtesttest'),
  token: '',
}

export const UserAdmin3: User = {
  id: padTo32('admin3'),
  contestId: ContestArkav5Qual.id,
  username: 'admin',
  email: 'admin@example.com',
  name: 'Administrator',
  permissions: adminPermissions.slice(),
  password: hashSync('testtest'),
  token: '',
}

export const UserTest3: User = {
  id: padTo32('5'),
  contestId: ContestArkav5Qual.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
  password: hashSync('newtesttest'),
  token: '',
}

export const UserNewTest3: User = {
  id: padTo32('6'),
  contestId: ContestArkav5Qual.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
  password: hashSync('adminadmin'),
  token: '',
}

export const UserTest4: User = {
  id: padTo32('7'),
  contestId: ContestArkav5Final.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
  password: hashSync('testtest'),
  token: '',
}

export const UserNewTest4: User = {
  id: padTo32('8'),
  contestId: ContestArkav5Final.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
  password: hashSync('newtesttest'),
  token: '',
}

export const users = [
  UserTest1,
  UserNewTest1,
  UserTest2,
  UserNewTest2,
  UserTest3,
  UserNewTest3,
  UserAdmin3,
  UserTest4,
  UserNewTest4,
]
