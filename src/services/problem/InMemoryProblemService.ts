import { ProblemService } from "./ProblemService"
import { Problem } from "./Problem";
import { problemsFixture } from "./fixtures"
import { NoSuchProblem } from "./errors";

export class InMemoryProblemService implements ProblemService {

    private problems: Problem[] = []

    constructor(problems: Problem[] = problemsFixture) {
        this.problems = problems
    }

    async getProblemById(id: number): Promise<Problem> {
        await new Promise(resolve => setTimeout(resolve, 1500))
        if (id < 0)
            throw new Error("Connection Error")

        const problem = this.problems.filter(x => x.id === id).slice().pop()
        if (problem)
            return problem
        throw new NoSuchProblem("No Such Problem")
    }
    
    async getProblemByIds(ids: number[]): Promise<Problem[]> {
        await new Promise(resolve => setTimeout(resolve, 1500))
        if (ids.length === 0)
            throw new Error("Connection Error")

        return this.problems.filter(x => x.id in ids).slice()
    }


}