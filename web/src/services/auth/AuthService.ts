import { User } from './User'
import { UserPermission } from './UserPermission'

export interface AuthService {
  /**
   * Get user by its id.
   * @param userId User's id
   * @return User
   */
  getUserById(userId: string): Promise<User>

  /**
   * Get all user information in a contest
   * @param contestId The contest id
   * @return list of user in the specific contest
   */
  getUsers(contestId: string): Promise<User[]>

  /**
   * Get user information in a contest by their email.
   *
   * @param contestId - The contest id
   * @param email - The email
   * @returns User's information.
   */
  getUserByEmail(contestId: string, email: string): Promise<User>

  /**
   * Get some user information in a contest by their usernames
   *
   * @param contestId - The contest id
   * @param username - List of user's usernames in the contest
   * @returns List of User
   */
  getUserByUsernames(contestId: string, usernames: string[]): Promise<User[]>

  /**
   * Sign in to specific contest. This will create session for user.
   * @param contestId - The contest id
   * @param email - User email
   * @param password - User password
   * @return string contains token that identified user's session
   */
  signin(contestId: string, email: string, password: string): Promise<string>

  /**
   * Sign up to specific contest. When contest administrator invited a user to
   * a contest, that user is considered as 'registered' to the contest, but not
   * yet signed up. User need to signed up and fill some information like
   * username, password and fullname. The user will get one time code in their
   * email to verify the email address. After signed up, user automatically
   * signed in.
   *
   * @param contestId - The contest id
   * @param username - User's username
   * @param email - User's email
   * @param oneTimeCode - One time code for verifying user's email
   * @param password - User's password
   * @param name - User's name
   * @return String contains token that identified user's session
   */
  signup(
    contestId: string,
    username: string,
    email: string,
    oneTimeCode: string,
    password: string,
    name: string
  ): Promise<string>

  /**
   * Send forgot password request. User will get an email containing one time
   * code to reset the password.
   *
   * @param contestId - The contest id
   * @param email - User's email
   */
  forgotPassword(contestId: string, email: string): Promise<void>

  /**
   * Reset user's password.
   *
   * @param contestId - The contest id
   * @param email - User's email
   * @param oneTimeCode - One time code for verifying user's email
   * @param password - User's new password
   */
  resetPassword(contestId: string, email: string, oneTimeCode: string, password: string): Promise<void>

  /**
   * Add users to the contests
   *
   * @param token User's token
   * @param users list of user's email and permissions
   * @returns List of string contains added user emails
   */
  addUser(token: string, users: Array<{ email: string; permissions: UserPermission[] }>): Promise<string[]>

  /**
   * Get user's information (id, contest id and username) from server.
   * @param token User's session token
   * @return User's information
   */
  getMe(token: string): Promise<User>

  /**
   * Change user's password.
   *
   * @param token User's session token
   * @param oldPassword User's old password
   * @param newPassword User's new password
   */
  setMyPassword(token: string, oldPassword: string, newPassword: string): Promise<void>

  /**
   * Set users's fullname
   *
   * @param token User's session token
   * @param name New user's name
   */
  setMyName(token: string, name: string): Promise<void>

  /**
   * Set users's permission
   *
   * @param token User's session token
   * @param name User's id
   * @param permissions User's new permission after updated
   */
  setUserPermissions(token: string, userId: string, permissions: UserPermission[]): Promise<UserPermission[]>
}
