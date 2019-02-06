import { User, setMe, setSignedOut } from "../../stores/Auth"
import { AppThunkAction } from "../../stores"
import { AuthenticationError } from "../../services/auth"
import ActionToaster from "../../middlewares/ErrorToaster/ActionToaster"

export const getMeAction = (): AppThunkAction<User> => {
    return async (dispatch, getState, { authService }) => {
        try {
            const token = getState().auth.token
            const me = await authService.getMyProfile(token)
            await dispatch(setMe(me))
            return me
        } catch (error) {
            if (error instanceof AuthenticationError)
                dispatch(setSignedOut())
            throw error
        }
    }
}

export const setMeSignOut = (): AppThunkAction => {
    return async (dispatch) => {
        await dispatch(setSignedOut())
        ActionToaster.showSuccessToast("You are signed out")
    }
}