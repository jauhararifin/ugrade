import { Contest, ContestDetail } from "./ContestState"

export enum ContestActionType {
    SetContests = "CONTEST_SET_CONTESTS",
    SetCurrentContest = "CONTEST_SET_CURRENT_CONTEST"
}

export interface ContestActionSetContests {
    type: ContestActionType.SetContests
    contests: Contest[]
}

export interface ContestActionSetCurrentContest {
    type: ContestActionType.SetCurrentContest
    contest: ContestDetail
}

export type ContestAction = ContestActionSetContests | ContestActionSetCurrentContest

export const setContests = (contests: Contest[]): ContestActionSetContests => ({
    type: ContestActionType.SetContests,
    contests
})

export const setCurrentContest = (contest: ContestDetail): ContestActionSetCurrentContest => ({
    type: ContestActionType.SetCurrentContest,
    contest
})