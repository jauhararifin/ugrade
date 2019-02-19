import { FormGroup, InputGroup, Label } from '@blueprintjs/core'
import classnames from 'classnames'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import './styles.css'

import BottomLink from '../../components/BottomLink'
import MyAccountPassword from './MyAccountPassword'
import MyAccountProfile from './MyAccountProfile'

export interface MyAccountViewProps {
  loading: boolean
}

const MyAccountViewFormSkeleton: FunctionComponent = () => (
  <React.Fragment>
    {[0, 0, 0].map(() => (
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
    ))}
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

      {!loading && <MyAccountProfile />}
      {!loading && <MyAccountPassword />}
    </div>
    <BottomLink>
      <Link to='/'>Home</Link>
    </BottomLink>
  </div>
)

export default MyAccountView
