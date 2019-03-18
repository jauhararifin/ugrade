import { Button } from '@blueprintjs/core'
import React, { FunctionComponent, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import { Markdown } from '../Markdown/Markdown'

import 'brace/mode/markdown'
import 'brace/theme/github'

import './styles.css'

export interface MarkdownEditProps {
  name?: string
  onChange: (value: string) => any
  onBlur?: React.FormEventHandler<HTMLElement>
  value: string
}

export const MarkdownEdit: FunctionComponent<MarkdownEditProps> = ({
  name,
  onChange,
  onBlur,
  value,
}) => {
  const [localValue, setLocalValue] = useState('')
  const [preview, setPreview] = useState(false)

  useEffect(() => setLocalValue(value), [value])

  const handleChange = (val: string) => {
    onChange(val)
    setLocalValue(val)
  }

  const tooglePreview = () => setPreview(!preview)

  return (
    <div className='ugrade-markdown-edit'>
      <div className='actions'>
        <Button active={preview} onClick={tooglePreview}>
          Preview
        </Button>
      </div>
      {preview ? (
        <div className='preview'>
          <Markdown source={value} />
        </div>
      ) : (
        <div className='editor'>
          <AceEditor
            name={name}
            mode='markdown'
            theme='github'
            editorProps={{ $blockScrolling: true }}
            fontSize={18}
            width='100%'
            minLines={10}
            maxLines={20}
            showPrintMargin={false}
            value={localValue}
            onBlur={onBlur}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  )
}
