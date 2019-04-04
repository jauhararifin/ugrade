import { Intent, Tag } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'

export interface VerdictProps {
  verdict: string
}

export const Verdict: FunctionComponent<VerdictProps> = ({ verdict }) => {
  switch (verdict) {
    case 'AC':
      return <Tag intent={Intent.SUCCESS}>Accepted</Tag>
    case 'WA':
      return <Tag intent={Intent.DANGER}>Wrong Answer</Tag>
    case 'TLE':
      return <Tag intent={Intent.WARNING}>Time Limit Exceeded</Tag>
    case 'MLE':
      return <Tag intent={Intent.WARNING}>Memory Limit Exceeded</Tag>
    case 'RTE':
      return <Tag intent={Intent.WARNING}>Runtime Error</Tag>
    case 'CE':
      return <Tag intent={Intent.WARNING}>Compilation Error</Tag>
    case 'IE':
      return <Tag intent={Intent.WARNING}>Internal Error</Tag>
    default:
      return <Tag>Pending</Tag>
  }
}
