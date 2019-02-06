import { ContestService } from "./ContestService"
import { Contest } from "./Contest"
import { contests } from "./fixtures"

export class InMemoryContestService implements ContestService {

    private contests: Contest[] = []

    constructor() {
        this.contests = contests
    }

    async getAllContests(): Promise<Contest[]> {
        await new Promise(resolve => setTimeout(resolve, 1500))
        return this.contests
    }

}