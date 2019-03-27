import { Formik, FormikActions } from 'formik'
import React, { FunctionComponent } from 'react'
import * as yup from 'yup'
import { showErrorToast } from '../../../../common'
import { Problem } from '../../../../problem'
import { ProblemEditorView } from './ProblemEditorView'

export interface ProblemFormValue {
  shortId: string
  name: string
  statement: string
  disabled: boolean
  timeLimit: number
  tolerance: number
  memoryLimit: number
  outputLimit: number
}

export interface ProblemEditorProps {
  problem?: Problem
  onSubmit?: (values: ProblemFormValue) => any
}

export const ProblemEditor: FunctionComponent<ProblemEditorProps> = ({ problem, onSubmit }) => {
  const initialValue: ProblemFormValue = {
    shortId: problem ? problem.shortId : 'a-plus-b',
    name: problem ? problem.name : 'A Plus B',
    statement: problem ? problem.statement : 'Given $A$ and $B$, Output $A+B$',
    disabled: problem ? problem.disabled : false,
    timeLimit: problem ? problem.timeLimit : 1000,
    tolerance: problem ? problem.tolerance : 1.5,
    memoryLimit: problem ? problem.memoryLimit : 16 * 1024 * 1024,
    outputLimit: problem ? problem.outputLimit : 32 * 1024,
  }

  const validationSchema = yup.object().shape({
    shortId: yup
      .string()
      .label('Problem ID')
      .max(255)
      .matches(/[a-zA-Z0-9\-]+/, 'Must contain alpha numeric or dash character only')
      .required(),
    name: yup
      .string()
      .label('Problem Name')
      .min(4)
      .max(255)
      .required(),
    statement: yup
      .string()
      .label('Problem Statement')
      .required(),
    disabled: yup.bool().required(),
    timeLimit: yup
      .number()
      .label('Time Limit')
      .integer()
      .min(1000)
      .max(10000)
      .required(),
    tolerance: yup
      .number()
      .label('Tolerance Factor')
      .min(0.1)
      .max(10)
      .required(),
    memoryLimit: yup
      .number()
      .label('Memory Limit')
      .integer()
      .min(16 * 1024 * 1024)
      .max(512 * 1024 * 1024)
      .required(),
    outputLimit: yup
      .number()
      .label('Output Limit')
      .integer()
      .min(1)
      .max(512 * 1024 * 1024)
      .required(),
  })

  const handleSubmit = async (values: ProblemFormValue, { setSubmitting }: FormikActions<ProblemFormValue>) => {
    try {
      if (onSubmit) {
        await Promise.resolve(onSubmit(values))
      }
    } catch (error) {
      showErrorToast(error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      component={ProblemEditorView}
    />
  )
}
