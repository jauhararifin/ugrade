import { createMuiTheme } from '@material-ui/core/styles'
import { grey, blueGrey } from '@material-ui/core/colors'

const theme = createMuiTheme({
    palette: {
        primary: {
            ...grey,
            main: grey[900]
        },
        secondary: {
            ...blueGrey,
            main: blueGrey[900]
        }
    }
})

export default theme