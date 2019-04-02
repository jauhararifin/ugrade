import { H1 } from '@blueprintjs/core'
import React, { CSSProperties, FunctionComponent, HTMLProps } from 'react'

export type HeaderProps = HTMLProps<HTMLDivElement>

export const Header: FunctionComponent<HeaderProps> = props => {
  const styles: CSSProperties = {
    textAlign: 'center',
    marginBottom: 30,
    ...props.style,
  }
  return (
    <div {...props} style={styles}>
      <H1>{props.children}</H1>
    </div>
  )
}
