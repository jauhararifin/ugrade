import { ApolloError } from 'apollo-boost'
import { Component, ErrorInfo } from 'react'
import { showErrorToast } from './toaster'

export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error)
    console.info(info)
  }
  render() {
    return this.props.children
  }
}

export function showError(error: Error) {
  if (error instanceof ApolloError) {
    if (error.graphQLErrors.length > 0) error.message = error.graphQLErrors[0].message
    else if (error.networkError) error.message = error.networkError.message
  }
  showErrorToast(error)
}
