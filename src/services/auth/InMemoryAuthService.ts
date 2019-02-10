import { AuthService } from './AuthService'
import { User, GenderType, ShirtSizeType } from './User'
import { AuthenticationError, UserRegistrationError } from './errors'

export class InMemoryAuthService implements AuthService {

    private users: { [username: string] : User }
    private usersPassword: { [username: string] : string }
    private usersToken: { [username: string] : string }

    constructor() {
        const defaultUser: User = {
            username: 'test',
            name: 'Test',
            email: 'test@example.com',
        }
        this.users = { [defaultUser.username]: defaultUser }
        this.usersPassword = { [defaultUser.username]: 'test' }
        this.usersToken = { [defaultUser.username]: 'test---somefaketoken' }
    }

    async login(username: string, password: string): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (username[0] === '.') {
            throw new Error("Connection Error")
        }
        if (this.usersPassword[username] && this.usersPassword[username] === password) {
            return this.usersToken[username]
        }
        throw new AuthenticationError('Wrong username or password')
    }
    
    async register(username: string, name: string, email: string, password: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (username[0] === '.') {
            throw new Error("Connection Error")
        }

        for (const userUsername in this.users) {
            if (userUsername === username) {
                throw new UserRegistrationError("Username already taken")
            }
            if (this.users[userUsername].email === email) {
                throw new UserRegistrationError("Email already taken")
            }
        }
        this.users[username] = { username, name, email }
        this.usersPassword[username] = password
        this.usersToken[username] = `${username}---${Math.random().toString(36).substring(7)}`
    }

    async forgotPassword(usernameOrEmail: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (usernameOrEmail[0] === '.') {
            throw new Error("Connection Error")
        }
    }

    async getMe(token: string): Promise<User> {
        const { username, name, email } = await this.getMyProfile(token)
        return { username, name, email }
    }

    async getMyProfile(token: string): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (token[0] === '.') {
            throw new Error("Connection Error")
        }

        const matches = token.match(/^([a-zA-Z0-9_]+)---(.+)$/)
        if (matches) {
            return this.users[matches[1]]
        }
        throw new AuthenticationError('Invalid token')
    }

    async setMyProfile(token: string, name?: string, gender?: GenderType, shirtSize?: ShirtSizeType, address?: string): Promise<User> {
        const me = {...await this.getMyProfile(token)}

        if (name)
            me.name = name
        if (gender)
            me.gender = gender
        if (shirtSize)
            me.shirtSize = shirtSize
        if (address)
            me.address = address
        this.users[me.username] = me

        return me
    }

    async setMyPassword(token: string, oldPassword: string, newPassword: string): Promise<void> {
        const me = {...await this.getMyProfile(token)}
        if (this.usersPassword[me.username] === oldPassword) {
            this.usersPassword[me.username] = newPassword
            return
        }
        throw new AuthenticationError('Wrong password')
    }

}