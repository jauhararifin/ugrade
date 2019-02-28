import { Intent, IToaster, Position, Toaster } from '@blueprintjs/core'

export interface IActionToaster {
  showToast(message: string): void
  showSuccessToast(message: string): void
  showAlertToast(message: string): void
  showErrorToast(error: Error): void
}

export class ActionToaster implements IActionToaster {
  constructor(
    private toaster: IToaster = Toaster.create({
      position: Position.TOP,
      className: 'toast',
    })
  ) {
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
    const message = error.message
    this.toaster.show({
      icon: 'warning-sign',
      message,
      intent: Intent.DANGER,
    })
  }
}
