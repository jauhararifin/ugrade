import logo from '@/assets/images/logo.svg'
import { BottomLink } from '@/components/BottomLink/BottomLink'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { CreateContestForm } from './CreateContestForm'

export const CreateContestView: FunctionComponent = () => (
  <div className='plain-page'>
    <div>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <CreateContestForm />
    </div>
    <BottomLink>
      <Link to='/enter-contest'>Enter Contest</Link>
    </BottomLink>
  </div>
)
