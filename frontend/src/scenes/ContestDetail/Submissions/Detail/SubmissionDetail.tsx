import React, { Component } from 'react'
import ActionToaster from '../../../../middlewares/ErrorToaster/ActionToaster'

import {
  SubmissionDetailView,
  SubmissionDetailViewProps,
} from './SubmissionDetailView'

export type SubmissionDetailProps = SubmissionDetailViewProps

export interface SubmissionDetailState {
  sourceCodeContent?: string
}

export class SubmissionDetail extends Component<
  SubmissionDetailProps,
  SubmissionDetailState
> {
  constructor(props: SubmissionDetailProps) {
    super(props)
    this.state = {
      sourceCodeContent: this.props.sourceCodeContent,
    }
  }

  componentDidMount() {
    if (this.props.submission && this.props.submission.sourceCode) {
      this.fetchSourceCodeContent(this.props.submission.sourceCode)
    }
  }

  componentDidUpdate(prevProps: SubmissionDetailProps) {
    const prevSourceCode =
      prevProps.submission && prevProps.submission.sourceCode
    const newSourceCode =
      this.props.submission && this.props.submission.sourceCode

    if (newSourceCode && prevSourceCode !== newSourceCode) {
      this.fetchSourceCodeContent(newSourceCode)
    }
  }

  async fetchSourceCodeContent(sourceCodeUrl: string) {
    try {
      const result = await fetch(sourceCodeUrl)
      const sourceCodeContent = await result.text()
      this.setState({ sourceCodeContent })
    } catch (error) {
      this.setState({ sourceCodeContent: undefined })
      ActionToaster.showErrorToast(
        new Error('Cannot Fetch Source Code Content')
      )
    }
  }

  render() {
    return (
      <SubmissionDetailView
        {...this.props}
        sourceCodeContent={this.state.sourceCodeContent}
      />
    )
  }
}
