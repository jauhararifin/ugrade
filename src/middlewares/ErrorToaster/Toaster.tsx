import { Intent, Position, Toaster, IToaster } from '@blueprintjs/core'
import { ForbiddenActionError } from '../../services/auth'

export interface ActionToaster {
    showToast(message: string): void
    showSuccessToast(message: string): void
    showAlertToast(message: string): void
    showErrorToast(error: any): void
}

export function createActionToaster(toaster: IToaster): ActionToaster {
    return {
        showToast: (message: string) => {
            toaster.show({
                message,
                intent: Intent.NONE,
                timeout: 1500,
            })
        },

        showSuccessToast: (message: string) => {
            toaster.show({
                icon: 'tick',
                message,
                intent: Intent.SUCCESS,
                timeout: 1500,
            })
        },

        showAlertToast: (message: string) => {
            toaster.show({
                icon: 'envelope',
                message,
                intent: Intent.WARNING,
                timeout: 0,
            })
        },

        showErrorToast: (error: any) => {
            let message: string
            if (error instanceof ForbiddenActionError) {
                message = 'Operation not allowed.'
            } else {
                message = error.message
            }

            toaster.show({
                icon: 'warning-sign',
                message,
                intent: Intent.DANGER,
            })
        },
    }
}

const injectedToaster = Toaster.create({
  position: Position.TOP,
  className: 'toast',
})

export default createActionToaster(injectedToaster)