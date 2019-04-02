import logo from '@/assets/images/logo.svg'
import { Button, Intent } from '@blueprintjs/core'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import './styles.css'

export const HomeView: FunctionComponent = () => (
  <div className='plain-page'>
    <div className='home-panel'>
      <Link to='/'>
        <img src={logo} width={100} alt='logo' />
      </Link>
      <h1>Welcome To UGrade</h1>
      <h4>
        There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain...
      </h4>
      <div className='home-actions'>
        <Link to='/create-contest'>
          <Button fill={true} large={true} className='item'>
            Create Contest
          </Button>
        </Link>
        <Link to='/enter-contest'>
          <Button fill={true} large={true} className='item' intent={Intent.PRIMARY}>
            Enter Contest
          </Button>
        </Link>
      </div>
    </div>
  </div>
)
