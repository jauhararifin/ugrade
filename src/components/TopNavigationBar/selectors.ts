import { AppState } from "../../stores"
import { IBreadcrumbProps } from "@blueprintjs/core"

export const selectBreadcrumb = (state: AppState): IBreadcrumbProps[] => {
    const location = state.router.location.pathname.slice().split("/").filter(x => x).reverse()
    
    const result: IBreadcrumbProps[] = []
    const item = location.pop()

    if (item === 'contests') {
        result.push({ href:"/contests", text: "Contests" })
        const currentContest = state.contest.currentContest
        const currentContestId = location.pop()
        if (currentContestId && currentContest) {
            result.push({ href:`/contests/${currentContestId}`, text: currentContest.name})
        }
    }

    return result
}