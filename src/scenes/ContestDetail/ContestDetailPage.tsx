import React, { SFC, ReactNode } from "react"
import "github-markdown-css"

import "./styles.css"

import TopNavigationBar from "../../components/TopNavigationBar"
import Sidebar from "./Sidebar"

export interface ContestDetailPageProps {
    children?: ReactNode
}

export const ContestDetailPage: SFC<ContestDetailPageProps> = ({ children }) => {
    return (
        <div className="full-page">
            <TopNavigationBar />
            <div className="contests-panel">
                <Sidebar />
                <div className="contest-content">
                    { children }
                </div>
            </div>
        </div>
    )

}

export default ContestDetailPage