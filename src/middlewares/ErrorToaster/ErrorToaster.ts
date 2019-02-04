import Toaster, { ActionToaster } from "./Toaster"
import { Middleware, MiddlewareAPI, Dispatch } from "redux"

export function createErrorToasterMiddleware(toaster: ActionToaster) {
    return (store: any) => (next: any) => async (action: any) => {
        try {
            return await next(action)
        } catch (error) {
            toaster.showErrorToast(error);
            throw error;
        }
    }
} 

export default createErrorToasterMiddleware(Toaster)