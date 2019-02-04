import Toaster, { ActionToaster } from "./ActionToaster"
import { Middleware } from "redux"

export function createErrorToasterMiddleware(toaster: ActionToaster): Middleware {
    return store => next => async action => {
        try {
            return await next(action)
        } catch (error) {
            toaster.showErrorToast(error)
            throw error
        }
    }      
}

export default createErrorToasterMiddleware(Toaster)