import React from 'react'
import { TextField, Button, Typography } from '@material-ui/core'
import BottomLink from '../../components/BottomLink/BottomLink';
import { Link } from 'react-router-dom';

const LoginPage = () => (
    <React.Fragment>
        <div>
            <TextField placeholder="Username" />
            <TextField placeholder="Password" type="password" />
            <Button variant="contained" color="primary">Login</Button>
        </div>
        <BottomLink>
            <Link to='/setting'><Typography variant='body1' color='secondary'>Sign Up</Typography></Link>
            <Link to='/setting'><Typography variant='body1' color='secondary'>Forgot Password</Typography></Link>
            <Link to='/setting'><Typography variant='body1' color='secondary'>Setting</Typography></Link>
        </BottomLink>
    </React.Fragment>
)

export default LoginPage