import {
  ContestArkav4Final,
  ContestArkav4Qual,
  ContestArkav5Final,
  ContestArkav5Qual,
} from '../../contest/store'
import { Permission, UserModel } from './model'

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

export const contestantPermissions = [
  Permission.AnnouncementRead,
  Permission.ProblemsRead,
]

export const UserTest1: UserModel = {
  id: '1',
  contestId: ContestArkav4Qual.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
}

export const UserNewTest1: UserModel = {
  id: '2',
  contestId: ContestArkav4Qual.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
}

export const UserTest2: UserModel = {
  id: '3',
  contestId: ContestArkav4Final.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
}

export const UserNewTest2: UserModel = {
  id: '4',
  contestId: ContestArkav4Final.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
}

export const UserAdmin3: UserModel = {
  id: 'admin3',
  contestId: ContestArkav5Qual.id,
  username: 'admin',
  email: 'admin@example.com',
  name: 'Administrator',
  permissions: adminPermissions.slice(),
}

export const UserTest3: UserModel = {
  id: '5',
  contestId: ContestArkav5Qual.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
}

export const UserNewTest3: UserModel = {
  id: '6',
  contestId: ContestArkav5Qual.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
}

export const UserTest4: UserModel = {
  id: '7',
  contestId: ContestArkav5Final.id,
  username: 'test',
  email: 'test@example.com',
  name: 'Test',
  permissions: contestantPermissions,
}

export const UserNewTest4: UserModel = {
  id: '8',
  contestId: ContestArkav5Final.id,
  username: '',
  email: 'newtest@example.com',
  name: 'New Test',
  permissions: contestantPermissions,
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
