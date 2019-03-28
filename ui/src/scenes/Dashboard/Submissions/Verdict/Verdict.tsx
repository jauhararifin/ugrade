import { GradingVerdict } from '@/submission'
import { Intent, Tag } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'

export interface VerdictProps {
  verdict: GradingVerdict
}

export const Verdict: FunctionComponent<VerdictProps> = ({ verdict }) => {
  switch (verdict) {
    case GradingVerdict.AC:
      return <Tag intent={Intent.SUCCESS}>Accepted</Tag>
    case GradingVerdict.WA:
      return <Tag intent={Intent.DANGER}>Wrong Answer</Tag>
    case GradingVerdict.TLE:
      return <Tag intent={Intent.WARNING}>Time Limit Exceeded</Tag>
    case GradingVerdict.MLE:
      return <Tag intent={Intent.WARNING}>Memory Limit Exceeded</Tag>
    case GradingVerdict.RTE:
      return <Tag intent={Intent.WARNING}>Runtime Error</Tag>
    case GradingVerdict.CE:
      return <Tag intent={Intent.WARNING}>Compilation Error</Tag>
    case GradingVerdict.IE:
      return <Tag intent={Intent.WARNING}>Internal Error</Tag>
    default:
      return <Tag>Pending</Tag>
  }
}
