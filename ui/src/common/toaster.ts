import { Intent, Position, Toaster } from '@blueprintjs/core'

const toaster = Toaster.create({
  position: Position.TOP,
  className: 'toast',
})

export function showToast(message: string): void {
  toaster.show({
    message,
    intent: Intent.NONE,
    timeout: 1500,
  })
}

export function showSuccessToast(message: string): void {
  toaster.show({
    icon: 'tick',
    message,
    intent: Intent.SUCCESS,
    timeout: 1500,
  })
}

export function showAlertToast(message: string): void {
  toaster.show({
    icon: 'envelope',
    message,
    intent: Intent.WARNING,
    timeout: 0,
  })
}

export function showErrorToast(error: Error): void {
  const message = error.message
  toaster.show({
    icon: 'warning-sign',
    message,
    intent: Intent.DANGER,
  })
}
