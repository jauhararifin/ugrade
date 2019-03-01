import { FormGroup, InputGroup, Label } from '@blueprintjs/core'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import BottomLink from 'ugrade/components/BottomLink'
import { MyAccountPasswordForm } from './MyAccountPasswordForm'
import { MyAccountProfileForm } from './MyAccountProfileForm'

import './styles.css'

export interface MyAccountViewProps {
  loading: boolean
}

const MyAccountViewFormSkeleton: FunctionComponent = () => (
  <React.Fragment>
    <h3 className='bp3-skeleton'>Account Profile</h3>
    <FormGroup className='bp3-skeleton' label='Fake'>
      <Label>
        <InputGroup placeholder='Name' />
      </Label>
      <Label>
        <InputGroup placeholder='Name' />
      </Label>
      <Label>
        <InputGroup placeholder='Name' />
      </Label>
    </FormGroup>
  </React.Fragment>
)

export const MyAccountView: FunctionComponent<MyAccountViewProps> = ({
  loading,
}) => (
  <div className='plain-page'>
    <div className='my-account-page-panel'>
      <div className={classnames({ 'bp3-skeleton': loading })}>
        <h2>Account Setting</h2>
      </div>

      {loading && <MyAccountViewFormSkeleton />}

      {!loading && <MyAccountProfileForm />}
      {!loading && <MyAccountPasswordForm />}
    </div>
    <BottomLink>
      <Link to='/contest'>Dashboard</Link>
    </BottomLink>
  </div>
)
