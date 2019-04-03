import { MarkdownEdit } from '@/components/MarkdownEdit/MarkdownEdit'
import { Button, FormGroup, InputGroup, Intent, Switch } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import { ProblemFormValue } from './ProblemEditor'

import './styles.css'

export type ProblemEditorViewProps = FormikProps<ProblemFormValue>

export const ProblemEditorView: FunctionComponent<ProblemEditorViewProps> = ({
  isSubmitting,
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  touched,
  setFieldValue,
}) => {
  return (
    <form onSubmit={handleSubmit} className='problem-editor-form'>
      <FormGroup
        labelFor='input-problem-short-id'
        label='Problem ID'
        helperText={touched.shortId && errors && errors.shortId}
        intent={touched.shortId && errors && errors.shortId ? Intent.DANGER : Intent.NONE}
      >
        <InputGroup
          id='input-problem-short-id'
          name='shortId'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.shortId}
        />
      </FormGroup>

      <FormGroup
        label='Problem Name'
        labelFor='input-problem-name'
        labelInfo='(required)'
        helperText={touched.name && errors && errors.name}
        intent={touched.name && errors && errors.name ? Intent.DANGER : Intent.NONE}
      >
        <InputGroup
          id='input-problem-name'
          name='name'
          placeholder='A Plus B'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.name}
        />
      </FormGroup>

      <FormGroup
        label='Problem Statement'
        helperText={touched.statement && errors && errors.statement}
        intent={touched.statement && errors && errors.statement ? Intent.DANGER : Intent.NONE}
      >
        <MarkdownEdit
          name='statement'
          onChange={setFieldValue.bind(null, 'statement')}
          onBlur={handleBlur}
          value={values.statement}
        />
      </FormGroup>

      <Switch name='disabled' label='Disable' onChange={handleChange} onBlur={handleBlur} checked={values.disabled} />

      <FormGroup
        label='Time Limit'
        labelFor='input-problem-timeLimit'
        labelInfo='In Milisecond'
        helperText={touched.timeLimit && errors && errors.timeLimit}
        intent={touched.timeLimit && errors && errors.timeLimit ? Intent.DANGER : Intent.NONE}
      >
        <InputGroup
          id='input-problem-timeLimit'
          name='timeLimit'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.timeLimit.toString()}
        />
      </FormGroup>

      <FormGroup
        label='Tolerance Factor'
        labelFor='input-problem-tolerance'
        helperText={touched.tolerance && errors && errors.tolerance}
        intent={touched.tolerance && errors && errors.tolerance ? Intent.DANGER : Intent.NONE}
      >
        <InputGroup
          id='input-problem-tolerance'
          name='tolerance'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.tolerance.toString()}
        />
      </FormGroup>

      <FormGroup
        label='Memory Limit'
        labelFor='input-problem-memoryLimit'
        labelInfo='In Bytes'
        helperText={touched.memoryLimit && errors && errors.memoryLimit}
        intent={touched.memoryLimit && errors && errors.memoryLimit ? Intent.DANGER : Intent.NONE}
      >
        <InputGroup
          id='input-problem-memoryLimit'
          name='memoryLimit'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.memoryLimit.toString()}
        />
      </FormGroup>

      <FormGroup
        label='Output Limit'
        labelFor='input-problem-outputLimit'
        labelInfo='In Bytes'
        helperText={touched.outputLimit && errors && errors.outputLimit}
        intent={touched.outputLimit && errors && errors.outputLimit ? Intent.DANGER : Intent.NONE}
      >
        <InputGroup
          id='input-problem-outputLimit'
          name='outputLimit'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.outputLimit.toString()}
        />
      </FormGroup>

      <div className='bottom-actions'>
        <Button type='submit' disabled={isSubmitting} icon='floppy-disk' large={true} intent={Intent.SUCCESS}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
