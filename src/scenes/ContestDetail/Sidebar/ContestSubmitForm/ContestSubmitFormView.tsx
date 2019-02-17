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
  avaiableLanguages: Array<{ label: string; value: number }>
  avaiableProblems: Array<{ label: string; value: number }>
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
}) => (
  <form onSubmit={handleSubmit}>
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
    <Button intent={Intent.PRIMARY} fill={true}>
      Submit
    </Button>
  </form>
)

export default ContestSubmitFormView
