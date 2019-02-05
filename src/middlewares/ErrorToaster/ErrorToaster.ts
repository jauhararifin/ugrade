import Toaster, { ActionToaster } from "./ActionToaster"
import { Middleware, Action } from "redux"

export function createErrorToasterMiddleware(toaster: ActionToaster): Middleware {
    return store => next => <A extends Action>(action: A):A => {
        const result = next(action)
        const promise = Promise.resolve(result).catch(error => {
            toaster.showErrorToast(error)
            throw error
        })
        return <A><unknown>promise
    }      
}

export default createErrorToasterMiddleware(Toaster)