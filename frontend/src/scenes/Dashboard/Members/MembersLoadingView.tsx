import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'
import { Content } from '../components/Content'

export const MembersLoadingView: FunctionComponent = () => (
  <Content>
    <TwoRowLoading />
  </Content>
)
