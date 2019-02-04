import { Intent, Position, Toaster, IToaster } from '@blueprintjs/core'
import { ForbiddenActionError } from '../../services/auth'

export interface ActionToaster {
    showToast(message: string): void
    showSuccessToast(message: string): void
    showAlertToast(message: string): void
    showErrorToast(error: Error): void
}

export class DefaultActionToaster implements ActionToaster {
    
    constructor(private toaster: IToaster) {
        this.toaster = toaster
    }
    
    showToast(message: string): void {
        this.toaster.show({
            message,
            intent: Intent.NONE,
            timeout: 1500,
        })
    }

    showSuccessToast(message: string): void {
        this.toaster.show({
            icon: 'tick',
            message,
            intent: Intent.SUCCESS,
            timeout: 1500,
        })
    }

    showAlertToast(message: string): void {
        this.toaster.show({
            icon: 'envelope',
            message,
            intent: Intent.WARNING,
            timeout: 0,
        })
    }

    showErrorToast(error: Error): void {
        let message = error.message
        if (error instanceof ForbiddenActionError) {
            message = 'Operation not allowed'
        }

        this.toaster.show({
            icon: 'warning-sign',
            message,
            intent: Intent.DANGER,
        })
    }

}

const injectedToaster = Toaster.create({
  position: Position.TOP,
  className: 'toast',
})

export default new DefaultActionToaster(injectedToaster)