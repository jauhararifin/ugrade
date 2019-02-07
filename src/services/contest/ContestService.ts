import { Contest } from "./Contest"

export interface ContestService {
    getAllContests(): Promise<Contest[]>
    getContestById(id: number): Promise<Contest>
}