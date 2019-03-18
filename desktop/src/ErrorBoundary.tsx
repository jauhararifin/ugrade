import { Component, ErrorInfo } from 'react'

export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error)
    console.info(info)
  }
  render() {
    return this.props.children
  }
}
