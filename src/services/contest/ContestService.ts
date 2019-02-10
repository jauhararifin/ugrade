import { Contest } from "./Contest"
import { Announcement } from "./Announcement"

export interface ContestService {
    getAllContests(): Promise<Contest[]>
    getContestById(id: number): Promise<Contest>
    getAccouncementsByContestId(contestId: number): Promise<Announcement[]>

    readAnnouncements(token: string, id: number[]): Promise<void>
}