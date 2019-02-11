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
import React, { FunctionComponent } from 'react'

export const ContestSubmitForm: FunctionComponent = () => (
  <form>
    <H5>Submit Solution</H5>
    <FormGroup>
      <ControlGroup fill={true}>
        <HTMLSelect className={Classes.FIXED} options={['C', 'C++', 'Java']} />
        <FileInput placeholder='Source Code' />
      </ControlGroup>
    </FormGroup>
    <FormGroup>
      <HTMLSelect
        fill={true}
        options={['Memotong Kue', 'Hashing', 'Kotak Coklat']}
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

export default ContestSubmitForm
