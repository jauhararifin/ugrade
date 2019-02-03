import React from 'react'
import { Button, Typography, Grid, Divider } from '@material-ui/core'
import { connect } from 'react-redux'
import { Path, LocationState } from 'history'
import { push, CallHistoryMethodAction } from 'connected-react-router'
import { Link } from 'react-router-dom'

import pattern from '../../assets/images/pattern-light.svg'
import logo from '../../assets/images/logo.svg'
import BottomLink from '../../components/BottomLink/BottomLink'

import './HomePage.css'

export interface HomePageProps {
  push(path: Path, state?: LocationState): CallHistoryMethodAction
}

const HomePage: React.SFC<HomePageProps> = ({ push }) => (
  <React.Fragment>
    <Grid container className='home-page' style={{ backgroundImage: `url(${pattern})`}} >
      <Grid item md={4} />
      <Grid item direction='column' className='home-page-content' md={4}>
        <div className='home-page-logo'>
          <img src={logo} alt='logo' width={100} />
        </div>
        <div className='home-page-title'>
          <Typography variant='h3'>
            Welcome To UGrade
          </Typography>
        </div>
        <div className='home-page-signin'>
          <Button size="large" variant="contained" fullWidth onClick={() => push('/signin')}>
            Sign In
          </Button>
        </div>
        <Divider />
        <div className='home-page-signup'>
          <Button size="large" variant="contained" color="primary" fullWidth onClick={() => push('/signup')}>
            Sign Up
          </Button>
        </div>
      </Grid>
      <Grid item md={4} />
    </Grid>
    <BottomLink>
      <Link to='/setting'><Typography variant='body1' color='secondary'>Setting</Typography></Link>
    </BottomLink>
  </React.Fragment>
)

export default connect(null, { push })(HomePage)
