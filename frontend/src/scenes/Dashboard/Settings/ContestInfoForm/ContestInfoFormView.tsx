import {
  Button,
  Checkbox,
  FormGroup,
  InputGroup,
  Intent,
  Switch,
} from '@blueprintjs/core'
import { DatePicker, TimePrecision } from '@blueprintjs/datetime'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import { MarkdownEdit } from 'ugrade/components/MarkdownEdit'
import { Language } from 'ugrade/contest/store'
import { ContestInfoFormValue } from './ContestInfoForm'

import './styles.css'

export interface ContestInfoFormViewProps
  extends FormikProps<ContestInfoFormValue> {
  availableLanguages: Language[]
}

export const ContestInfoFormView: FunctionComponent<
  ContestInfoFormViewProps
> = ({
  values,
  isSubmitting,
  handleSubmit,
  handleBlur,
  handleChange,
  touched,
  errors,
  setFieldValue,
  availableLanguages,
}) => (
  <form onSubmit={handleSubmit} className='contest-info-form'>
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
      helperText={touched.name && errors && errors.name}
      intent={
        touched.name && errors && errors.name ? Intent.DANGER : Intent.NONE
      }
    >
      <InputGroup
        id='input-contest-name'
        name='name'
        placeholder='ACM ICPC'
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.name}
      />
    </FormGroup>

    <FormGroup
      label='Short Description'
      labelFor='input-contest-short-desc'
      labelInfo='(required)'
      helperText={
        touched.shortDescription && errors && errors.shortDescription
          ? errors.shortDescription
          : 'Describe the contest in one sentence. This will shown when user want to signed in'
      }
      intent={
        touched.shortDescription && errors && errors.shortDescription
          ? Intent.DANGER
          : Intent.NONE
      }
    >
      <InputGroup
        id='input-contest-short-desc'
        name='shortDescription'
        placeholder='Yet Another Competitive Programming Competition'
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.shortDescription}
      />
    </FormGroup>

    <div className='contest-time'>
      <FormGroup
        className='contest-start-time'
        label='Contest Start Time'
        labelInfo='(required)'
        helperText={touched.startTime && errors && errors.startTime}
        intent={
          touched.startTime && errors && errors.startTime
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <DatePicker
          timePrecision={TimePrecision.MINUTE}
          onChange={setFieldValue.bind(null, 'startTime')}
          value={values.startTime}
        />
      </FormGroup>
      <FormGroup
        className='contest-finish-time'
        label='Contest Finish Time'
        labelInfo='(required)'
        helperText={touched.finishTime && errors && errors.finishTime}
        intent={
          touched.finishTime && errors && errors.finishTime
            ? Intent.DANGER
            : Intent.NONE
        }
      >
        <DatePicker
          timePrecision={TimePrecision.MINUTE}
          onChange={setFieldValue.bind(null, 'finishTime')}
          value={values.finishTime}
        />
      </FormGroup>
    </div>

    <Switch
      name='freezed'
      label='Freezed'
      onChange={handleChange}
      onBlur={handleBlur}
      checked={values.freezed}
    />

    <FormGroup
      label='Permitted Languages'
      labelInfo='(required)'
      helperText={
        touched.permittedLanguages && errors && errors.permittedLanguages
      }
      intent={
        touched.permittedLanguages && errors && errors.permittedLanguages
          ? Intent.DANGER
          : Intent.NONE
      }
    >
      {availableLanguages.map(language => (
        <Checkbox
          key={language.id}
          name='permittedLanguages'
          onChange={setFieldValue.bind(
            null,
            'permittedLanguages',
            values.permittedLanguages.filter(id => id !== language.id)
          )}
          onBlur={handleBlur}
          checked={values.permittedLanguages.includes(language.id)}
          label={language.name}
        />
      ))}
    </FormGroup>

    <FormGroup
      label='Contest Description'
      helperText={touched.description && errors && errors.description}
      intent={
        touched.description && errors && errors.description
          ? Intent.DANGER
          : Intent.NONE
      }
    >
      <MarkdownEdit
        name='description'
        onChange={setFieldValue.bind(null, 'description')}
        onBlur={handleBlur}
        value={values.description}
      />
    </FormGroup>

    <div className='submit'>
      <Button
        type='submit'
        disabled={isSubmitting}
        icon='floppy-disk'
        large={true}
        intent={Intent.SUCCESS}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </div>
  </form>
)
