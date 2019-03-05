import {
  Button,
  Checkbox,
  FormGroup,
  InputGroup,
  Intent,
  Switch,
} from '@blueprintjs/core'
import { DatePicker, TimePrecision } from '@blueprintjs/datetime'
import React, { FunctionComponent } from 'react'

import { MarkdownEdit } from 'ugrade/components/MarkdownEdit'
import './styles.css'

export const ContestInfoFormView: FunctionComponent = () => (
  <form className='contest-info-form'>
    <FormGroup labelFor='input-contest-short-id' label='Contest ID'>
      <InputGroup
        id='input-contest-short-id'
        disabled={true}
        value='arkavidia-50-qual'
      />
    </FormGroup>

    <FormGroup
      label='Contest Name'
      labelFor='input-contest-name'
      labelInfo='(required)'
    >
      <InputGroup id='input-contest-name' name='name' placeholder='ACM ICPC' />
    </FormGroup>

    <FormGroup
      helperText='Describe the contest in one sentence. This will shown when user want to signed in'
      label='Short Description'
      labelFor='input-contest-short-desc'
      labelInfo='(required)'
    >
      <InputGroup
        id='input-contest-short-desc'
        placeholder='Yet Another Competitive Programming Competition'
      />
    </FormGroup>

    <div className='contest-time'>
      <FormGroup
        className='contest-start-time'
        label='Contest Start Time'
        labelInfo='(required)'
      >
        <DatePicker timePrecision={TimePrecision.MINUTE} />
      </FormGroup>
      <FormGroup
        className='contest-freeze-time'
        label='Contest Freeze Time'
        labelInfo='(required)'
      >
        <DatePicker timePrecision={TimePrecision.MINUTE} />
      </FormGroup>
      <FormGroup
        className='contest-finish-time'
        label='Contest Finish Time'
        labelInfo='(required)'
      >
        <DatePicker timePrecision={TimePrecision.MINUTE} />
      </FormGroup>
    </div>

    <Switch label='Freezed' />

    <FormGroup label='Permitted Languages' labelInfo='(required)'>
      <Checkbox checked={true} label='C' />
      <Checkbox checked={true} label='C++11' />
      <Checkbox checked={true} label='Java' />
      <Checkbox checked={true} label='Python 2' />
      <Checkbox checked={true} label='Python 3' />
    </FormGroup>

    <FormGroup label='Contest Description'>
      <MarkdownEdit onChange={() => null} value='' />
    </FormGroup>

    <div className='submit'>
      <Button icon='floppy-disk' large={true} intent={Intent.SUCCESS}>
        Save
      </Button>
    </div>
  </form>
)
