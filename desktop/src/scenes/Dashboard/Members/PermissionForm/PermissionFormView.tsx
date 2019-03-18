import { Button, Checkbox, HTMLTable, Intent } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import lodash from 'lodash'
import React, { FunctionComponent } from 'react'
import { UserPermission } from 'ugrade/auth/store'
import { PermissionFormValue } from './PermissionForm'

import './styles.css'

export interface PermissionFormViewProps
  extends FormikProps<PermissionFormValue> {
  availablePermissions: UserPermission[]
  updatablePermissions: UserPermission[]
}

export const PermissionFormView: FunctionComponent<PermissionFormViewProps> = ({
  availablePermissions,
  updatablePermissions,
  handleSubmit,
  isSubmitting,
  values,
  setFieldValue,
}) => {
  const chucks = lodash.chunk(availablePermissions, 4)
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const perm = e.target.name as UserPermission
    let currentValue = values.permissions
    if (currentValue.includes(perm)) {
      currentValue = currentValue.filter(p => p !== perm)
    } else {
      currentValue.push(perm)
    }
    setFieldValue('permissions', currentValue)
  }
  return (
    <form onSubmit={handleSubmit} className='permission-form'>
      <HTMLTable className='permission-table'>
        <tbody>
          {chucks.map((ch, i) => (
            <tr key={i}>
              {ch.map(perm => {
                const checked = values.permissions.includes(perm)
                const disabled = !updatablePermissions.includes(perm)
                return (
                  <td key={perm}>
                    <Checkbox
                      name={perm}
                      checked={checked}
                      label={perm}
                      disabled={disabled}
                      onChange={handleChange}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </HTMLTable>
      <div className='actions'>
        <Button
          disabled={isSubmitting}
          intent={Intent.SUCCESS}
          type='submit'
          icon='floppy-disk'
        >
          {isSubmitting ? `Saving...` : `Save`}
        </Button>
      </div>
    </form>
  )
}
