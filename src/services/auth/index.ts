
export interface User {
    username: string
    name: string
    email: string
}

export interface LoginService {
    login(username: string, password: string): Promise<string>
    register(username: string, name: string, email: string, password: string): Promise<void>
    getMyProfile(token: string): Promise<User>
}

export class AuthenticationError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

export class ForbiddenActionError extends AuthenticationError {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, ForbiddenActionError.prototype);
    }
}

export class UserRegistrationError extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, UserRegistrationError.prototype);
    }
}

export class InMemoryLoginService implements LoginService {

    private users: { [username: string] : User }
    private usersPassword: { [username: string] : string }
    private usersToken: { [username: string] : string }

    constructor() {
        this.users = {}
        this.usersPassword = {}
        this.usersToken = {}
    }

    async login(username: string, password: string): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (username[0] === '.') {
            throw new Error("connection error")
        }
        if (this.usersPassword[username] && this.usersPassword[username] === password) {
            return this.usersToken[username]
        }
        throw new AuthenticationError('wrong username or password')
    }
    
    async register(username: string, name: string, email: string, password: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (username[0] === '.') {
            throw new Error("connection error")
        }

        for (const userUsername in this.users) {
            if (userUsername === username) {
                throw new UserRegistrationError("username already taken")
            }
            if (this.users[userUsername].email === email) {
                throw new UserRegistrationError("email already taken")
            }
        }
        this.users[username] = { username, name, email }
        this.usersPassword[username] = password
        this.usersToken[username] = `${username}---${Math.random().toString(36).substring(7)}`
    }

    async getMyProfile(token: string): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (token[0] === '.') {
            throw new Error("connection error")
        }

        const matches = token.match(/^([a-zA-Z0-9_]+)---(.+)$/)
        if (matches) {
            return this.users[matches[1]]
        }
        throw new AuthenticationError('Invalid token')
    }

}