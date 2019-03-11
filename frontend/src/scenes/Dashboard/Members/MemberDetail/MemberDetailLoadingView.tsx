import React, { FunctionComponent } from 'react'
import { TwoRowLoading } from 'ugrade/components/TwoRowLoading'
import { Content } from '../../components/Content'

import './styles.css'

export const MemberDetailLoadingView: FunctionComponent = () => (
  <Content>
    <TwoRowLoading />
  </Content>
)
