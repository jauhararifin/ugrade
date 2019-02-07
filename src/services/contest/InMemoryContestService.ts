import { ContestService } from "./ContestService"
import { Contest } from "./Contest"
import { contests } from "./fixtures"
import { NoSuchContest } from "./errors"

export class InMemoryContestService implements ContestService {

    private contests: Contest[] = []

    constructor() {
        this.contests = contests
    }

    async getAllContests(): Promise<Contest[]> {
        await new Promise(resolve => setTimeout(resolve, 1500))
        return this.contests
    }

    async getContestById(id: number): Promise<Contest> {
        await new Promise(resolve => setTimeout(resolve, 1500))
        if (id === 0)
            throw new Error("Connection Error")

        const contest = contests.slice().filter(x => x.id === id).pop()
        if (contest)
            return contest
        throw new NoSuchContest("No Such Contest")
    }

}