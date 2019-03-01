import React, {
  ComponentType,
  FunctionComponent,
  useEffect,
  useState,
} from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { setTitle } from 'ugrade/common/title/store'
import { contestOnly } from 'ugrade/helpers/auth'
import { AppThunkDispatch } from 'ugrade/store'
import { User } from 'ugrade/stores/Auth'
import { getMyProfile } from './actions'
import { MyAccountView } from './MyAccountView'

export interface MyAccountProps {
  dispatch: AppThunkDispatch
}

export interface MyAccountState {
  me?: User
}

export const MyAccount: FunctionComponent<MyAccountProps> = ({ dispatch }) => {
  const [me, setMe] = useState(undefined as User | undefined)
  const getProfile = async () => setMe(await dispatch(getMyProfile()))
  useEffect(() => {
    dispatch(setTitle('UGrade | My Account'))
    getProfile()
  })
  return <MyAccountView loading={!me} />
}

export default compose<ComponentType>(
  connect(),
  contestOnly()
)(MyAccount)
