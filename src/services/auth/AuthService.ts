import { User } from "./User"

export interface AuthService {
    login(username: string, password: string): Promise<string>
    register(username: string, name: string, email: string, password: string): Promise<void>
    getMyProfile(token: string): Promise<User>
}