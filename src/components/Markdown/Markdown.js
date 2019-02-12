import MathJax from '@matejmazur/react-mathjax'
import PropTypes from 'prop-types'
import 'github-markdown-css'
import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import RemarkMathPlugin from 'remark-math'

export class Markdown extends Component {
  static propTypes = {
    source: PropTypes.string,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.source !== nextProps.source
  }

  render() {
    const source = this.props.source
    const newProps = {
      source,
      plugins: [RemarkMathPlugin],
      renderers: {
        math: props => <MathJax.Node>{props.value}</MathJax.Node>,
        inlineMath: props => (
          <MathJax.Node inline={true}>{props.value}</MathJax.Node>
        ),
      },
    }
    return (
      <MathJax.Context input='tex'>
        <ReactMarkdown className='markdown-body' {...newProps} />
      </MathJax.Context>
    )
  }
}
