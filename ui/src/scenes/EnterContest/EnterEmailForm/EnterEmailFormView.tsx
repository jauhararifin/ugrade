import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'
import { EnterEmailFormValue } from './EnterEmailForm'

import './styles.css'

export interface EnterEmailFormViewOwnProps {
  contest: {
    name: string
    shortDescription: string
  }
  gotoAnotherContest: () => any
}

export type EnterEmailFormViewFormikProps = FormikProps<EnterEmailFormValue>

export type EnterEmailFormViewProps = EnterEmailFormViewOwnProps & EnterEmailFormViewFormikProps

export const EnterEmailFormView: React.FunctionComponent<EnterEmailFormViewProps> = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  submitCount,
  isSubmitting,
  contest,
  gotoAnotherContest,
}) => (
  <form className='enter-email-panel' onSubmit={handleSubmit}>
    <Card>
      <h2>Sign In To</h2>
      <h3>{contest.name}</h3>
      <p>{contest.shortDescription}</p>
      <FormGroup
        helperText={submitCount > 0 && errors && errors.email}
        labelFor='enter-contest-input-email'
        intent={submitCount && errors && errors.email ? Intent.DANGER : Intent.NONE}
      >
        <InputGroup
          name='email'
          large={true}
          id='enter-contest-input-email'
          placeholder='Email'
          type='email'
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus={true}
        />
      </FormGroup>
      <Button type='submit' disabled={isSubmitting} fill={true} large={true} intent={Intent.SUCCESS}>
        {isSubmitting ? 'Entering...' : 'Enter Contest'}
      </Button>
      <div className='goto-another-contest'>
        <a onClick={gotoAnotherContest}>Go To Another Contest</a>
      </div>
    </Card>
  </form>
)
