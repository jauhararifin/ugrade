import { AuthService } from './AuthService'
import { User } from './User'
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
            throw new Error("Connection error")
        }
        if (this.usersPassword[username] && this.usersPassword[username] === password) {
            return this.usersToken[username]
        }
        throw new AuthenticationError('Wrong username or password')
    }
    
    async register(username: string, name: string, email: string, password: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (username[0] === '.') {
            throw new Error("Connection error")
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

    async getMyProfile(token: string): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (token[0] === '.') {
            throw new Error("Connection error")
        }

        const matches = token.match(/^([a-zA-Z0-9_]+)---(.+)$/)
        if (matches) {
            return this.users[matches[1]]
        }
        throw new AuthenticationError('Invalid token')
    }

}