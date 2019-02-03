import React from 'react'
import { TextField, Button } from '@material-ui/core'

const LoginPage = () => (
    <div>
        <TextField placeholder="Username" />
        <TextField placeholder="Password" type="password" />
        <Button variant="contained" color="primary">Login</Button>
    </div>
)

export default LoginPage