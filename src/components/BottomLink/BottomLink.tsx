import React, { FunctionComponent, ReactNode } from 'react'

import './BottomLink.css'

export interface BottomLinkProps {
  children: ReactNode
  dividerColor?: string
}

export const BottomLink: FunctionComponent<BottomLinkProps> = ({
  children,
  dividerColor,
}) => (
  <div className='bottom-link'>
    {React.Children.map(
      children,
      item =>
        item && <span style={{ borderRightColor: dividerColor }}>{item}</span>
    )}
  </div>
)

BottomLink.defaultProps = {
  children: <React.Fragment />,
  dividerColor: 'black',
}

export default BottomLink
