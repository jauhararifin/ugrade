import { Problem } from "./Problem";

export interface ProblemService {
    getProblemById(id: number): Promise<Problem>
    getProblemByIds(ids: number[]): Promise<Problem[]>
}