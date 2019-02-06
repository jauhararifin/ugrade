import { AppState } from "../../stores"
import { IBreadcrumbProps } from "@blueprintjs/core"

export const selectBreadcrumb = (state: AppState): IBreadcrumbProps[] => {
    return [
        { href:"#", text: "Contests" },
        { href:"#", text: "Arkavidia Final" },
        { href:"#", text: "A. Memotong Kue" }
    ]
}