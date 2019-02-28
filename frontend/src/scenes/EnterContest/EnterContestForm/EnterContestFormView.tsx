import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React from 'react'
import { EnterContestFormValue } from './EnterContestForm'

import './styles.css'

export type EnterContestFormViewProps = FormikProps<EnterContestFormValue>

const EnterContestFormView: React.FunctionComponent<
  EnterContestFormViewProps
> = ({
  handleSubmit,
  handleChange,
  handleBlur,
  values,
  errors,
  submitCount,
  isSubmitting,
}) => (
  <form className='enter-contest-panel' onSubmit={handleSubmit}>
    <Card>
      <h2>Enter Contest</h2>
      <p>Insert Contest ID to enter the contest</p>
      <FormGroup
        helperText={submitCount > 0 && errors && errors.contestId}
        labelFor='enter-contest-input-contest-id'
        intent={
          submitCount && errors && errors.contestId
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <InputGroup
          name='contestId'
          large={true}
          id='enter-contest-input-contest-id'
          placeholder='Contest ID'
          value={values.contestId}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <Button
        type='submit'
        disabled={isSubmitting}
        fill={true}
        large={true}
        intent={Intent.SUCCESS}
      >
        {isSubmitting ? 'Entering Contest...' : 'Continue'}
      </Button>
    </Card>
  </form>
)

export default EnterContestFormView
