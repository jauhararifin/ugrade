import {
  Button,
  Classes,
  ControlGroup,
  FileInput,
  FormGroup,
  H5,
  HTMLSelect,
  Intent,
} from '@blueprintjs/core'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import { ContestSubmitFormValue } from './ContestSubmitForm'

export interface ContestSubmitFormViewOwnProps {
  avaiableLanguages?: Array<{ label: string; value: string }>
  avaiableProblems?: Array<{ label: string; value: string }>
}

export type ContestSubmitFormViewProps = FormikProps<ContestSubmitFormValue> &
  ContestSubmitFormViewOwnProps

export const ContestSubmitFormView: FunctionComponent<
  ContestSubmitFormViewProps
> = ({
  values,
  handleSubmit,
  handleChange,
  handleBlur,
  avaiableProblems,
  avaiableLanguages,
  isSubmitting,
}) => {
  const loading = !avaiableProblems || !avaiableLanguages
  return (
    <form className={loading ? 'bp3-skeleton' : ''} onSubmit={handleSubmit}>
      <H5>Submit Solution</H5>
      <FormGroup>
        <ControlGroup fill={true}>
          <HTMLSelect
            name='language'
            className={Classes.FIXED}
            options={avaiableLanguages}
            value={values.language}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FileInput placeholder='Source Code' />
          <input
            type='hidden'
            name='sourceCode'
            value='https://raw.githubusercontent.com/jauhararifin/cp/master/uva/820.cpp'
          />
        </ControlGroup>
      </FormGroup>
      <FormGroup>
        <HTMLSelect
          fill={true}
          name='problem'
          className={Classes.FIXED}
          options={avaiableProblems}
          value={values.problem}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </FormGroup>
      <p>
        Be careful: there is 50 points penalty for submission which fails the
        pretests or resubmission (except failure on the first test, denial of
        judgement or similar verdicts).
      </p>
      <Button
        type='submit'
        intent={Intent.PRIMARY}
        fill={true}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}

export default ContestSubmitFormView
