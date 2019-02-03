import React from 'react'
import { TextField, Button, Typography, Grid } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { withFormik, FormikProps } from 'formik'
import * as yup from 'yup'

import BottomLink from '../../components/BottomLink/BottomLink'
import logo from '../../assets/images/logo.svg'

import './LoginPage.css'

export interface LoginValue {
    username?: string,
    password?: string,
}

export interface LoginPageProps extends FormikProps<LoginValue>, LoginValue {
}

const LoginPage: React.SFC<LoginPageProps> = ({ 
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    status
}) => (
    <form onSubmit={handleSubmit}>
        <Grid container className="login-page-container">
            <Grid item md={4} />
            <Grid className="login-page-content" item md={4}>
                <div className='login-page-logo'>
                    <img src={logo} alt='logo' width={100} />
                </div>
                <div className='login-page-title'>
                    <Typography variant='h4'>
                        Sign In To UGrade
                    </Typography>
                </div>
                <div className="login-page-username">
                    { status && !status.success && (
                        <Typography variant='subtitle1' align='center' style={{ color: 'red' }}>
                            { status.message }
                        </Typography>
                    )}
                    <TextField
                        name="username"
                        placeholder="Username"
                        variant="outlined"
                        fullWidth
                        autoFocus
                        value={values.username}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={touched.username && !!errors.username}
                        helperText={touched.username && errors.username}
                    />
                </div>
                <div className="login-page-password">
                    <TextField
                        name="password"
                        placeholder="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete='off'
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        error={touched.password && !!errors.password}
                        helperText={touched.password && errors.password} 
                    />
                </div>
                <div className="login-page-login">
                    <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
                        { isSubmitting ? `Signing In...` : `Sign In` }
                    </Button>
                </div>
            </Grid>
            <Grid item md={4} />
        </Grid>
        <BottomLink>
            <Link to='/signup'><Typography variant='body1' color='secondary'>Sign Up</Typography></Link>
            <Link to='/forgot-password'><Typography variant='body1' color='secondary'>Forgot Password</Typography></Link>
            <Link to='/setting'><Typography variant='body1' color='secondary'>Setting</Typography></Link>
        </BottomLink>
    </form>
)

const formik = withFormik<LoginPageProps, LoginValue>({
    mapPropsToValues: ({username, password}) => ({
        username: username || '',
        password: password || '',
    }),
    validationSchema: yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
    }),
    handleSubmit: async (values, { props, setSubmitting, setStatus }) => {
        const status = {
            success: false,
            message: 'Wrong username or password',
        }
        setStatus(status)
        setSubmitting(false)
    },
})

export default formik(LoginPage)