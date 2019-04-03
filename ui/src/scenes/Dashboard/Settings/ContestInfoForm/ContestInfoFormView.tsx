import { MarkdownEdit } from '@/components/MarkdownEdit/MarkdownEdit'
import { Button, Checkbox, FormGroup, InputGroup, Intent, Switch } from '@blueprintjs/core'
import { DatePicker, TimePrecision } from '@blueprintjs/datetime'
import { FormikProps } from 'formik'
import React, { FunctionComponent } from 'react'
import { ContestInfoFormValue } from './ContestInfoForm'

import './styles.css'

export interface ContestInfoFormViewProps extends FormikProps<ContestInfoFormValue> {
  availableLanguages: Array<{ id: string; name: string }>
}

export const ContestInfoFormView: FunctionComponent<ContestInfoFormViewProps> = ({
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
      <InputGroup id='input-contest-short-id' disabled={true} value='arkavidia-50-qual' />
    </FormGroup>

    <FormGroup
      label='Contest Name'
      labelFor='input-contest-name'
      labelInfo='(required)'
      helperText={touched.name && errors && errors.name}
      intent={touched.name && errors && errors.name ? Intent.DANGER : Intent.NONE}
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
      intent={touched.shortDescription && errors && errors.shortDescription ? Intent.DANGER : Intent.NONE}
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

    <FormGroup
      label='Grading Size'
      labelFor='input-contest-grading-size'
      labelInfo='(required)'
      helperText={
        touched.gradingSize && errors && errors.gradingSize
          ? errors.gradingSize
          : 'How many times each submission have to graded'
      }
      intent={touched.gradingSize && errors && errors.gradingSize ? Intent.DANGER : Intent.NONE}
    >
      <InputGroup
        id='input-contest-short-desc'
        name='gradingSize'
        placeholder='Yet Another Competitive Programming Competition'
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.gradingSize.toString()}
      />
    </FormGroup>

    <div className='contest-time'>
      <FormGroup
        className='contest-start-time'
        label='Contest Start Time'
        labelInfo='(required)'
        helperText={touched.startTime && errors && errors.startTime}
        intent={touched.startTime && errors && errors.startTime ? Intent.DANGER : Intent.NONE}
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
        intent={touched.finishTime && errors && errors.finishTime ? Intent.DANGER : Intent.NONE}
      >
        <DatePicker
          timePrecision={TimePrecision.MINUTE}
          onChange={setFieldValue.bind(null, 'finishTime')}
          value={values.finishTime}
        />
      </FormGroup>
    </div>

    <Switch name='freezed' label='Freezed' onChange={handleChange} onBlur={handleBlur} checked={values.freezed} />

    <FormGroup
      label='Permitted Languages'
      labelInfo='(required)'
      helperText={touched.permittedLanguages && errors && errors.permittedLanguages}
      intent={touched.permittedLanguages && errors && errors.permittedLanguages ? Intent.DANGER : Intent.NONE}
    >
      {availableLanguages.map(language => {
        const checked = values.permittedLanguages.includes(language.id)
        const handleCheckboxChange = () => {
          if (checked) {
            setFieldValue('permittedLanguages', values.permittedLanguages.filter(id => id !== language.id))
          } else {
            setFieldValue('permittedLanguages', values.permittedLanguages.concat([language.id]))
          }
        }
        return (
          <Checkbox
            key={language.id}
            name='permittedLanguages'
            onChange={handleCheckboxChange}
            onBlur={handleBlur}
            checked={checked}
            value={language.id}
            label={language.name}
          />
        )
      })}
    </FormGroup>

    <FormGroup
      label='Contest Description'
      helperText={touched.description && errors && errors.description}
      intent={touched.description && errors && errors.description ? Intent.DANGER : Intent.NONE}
    >
      <MarkdownEdit
        name='description'
        onChange={setFieldValue.bind(null, 'description')}
        onBlur={handleBlur}
        value={values.description}
      />
    </FormGroup>

    <div className='submit'>
      <Button type='submit' disabled={isSubmitting} icon='floppy-disk' large={true} intent={Intent.SUCCESS}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </div>
  </form>
)
