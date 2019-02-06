import { Contest } from "./Contest"

export interface ContestService {
    getAllContests(): Promise<Contest[]>
}