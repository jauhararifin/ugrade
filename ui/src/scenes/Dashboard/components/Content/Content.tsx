import classnames from 'classnames'
import React, { CSSProperties, FunctionComponent, HTMLProps } from 'react'

export type ContentProps = HTMLProps<HTMLDivElement>

export const Content: FunctionComponent<ContentProps> = props => {
  const className = classnames('contest-dashboard-content', props.className)
  const styles: CSSProperties = {
    padding: '30px 100px',
    textAlign: 'left',
    width: '100%',
    ...props.style,
  }
  return <div {...props} style={styles} className={className} />
}
