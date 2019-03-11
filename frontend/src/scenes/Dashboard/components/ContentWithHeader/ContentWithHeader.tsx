import React, { FunctionComponent } from 'react'
import { Content, ContentProps } from '../Content'
import { Header } from '../Header'

export interface ContentWithHeaderProps extends ContentProps {
  header: string
}

export const ContentWithHeader: FunctionComponent<
  ContentWithHeaderProps
> = props => (
  <Content {...props}>
    <Header>{props.header}</Header>
    <div>{props.children}</div>
  </Content>
)
