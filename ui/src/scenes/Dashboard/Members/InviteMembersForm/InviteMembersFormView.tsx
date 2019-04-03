import { Button, Checkbox, FormGroup, H4, HTMLTable, Intent, TagInput } from '@blueprintjs/core'
import { FormikProps } from 'formik'
import lodash from 'lodash'
import React, { FunctionComponent } from 'react'
import { ContentWithHeader } from '../../components/ContentWithHeader/ContentWithHeader'
import { InviteMembersFormValue } from './InviteMembersForm'

import './styles.css'

export interface InviteMembersFormViewProps extends FormikProps<InviteMembersFormValue> {
  availablePermissions: string[]
  givablePermissions: string[]
  predifinedPermissions: { [label: string]: string[] }
}

export const InviteMembersFormView: FunctionComponent<InviteMembersFormViewProps> = ({
  values,
  handleSubmit,
  errors,
  setFieldValue,
  availablePermissions,
  givablePermissions,
  predifinedPermissions,
}) => {
  const handleClear = () => setFieldValue('emails', [])
  const clearButton = <Button icon='cross' minimal={true} onClick={handleClear} />

  const chucks = lodash.chunk(availablePermissions, 4)
  const handleChangePermission: React.ChangeEventHandler<HTMLInputElement> = e => {
    const perm = e.target.name
    let currentValue = values.permissions
    if (currentValue.includes(perm)) {
      currentValue = currentValue.filter(p => p !== perm)
    } else {
      currentValue.push(perm)
    }
    setFieldValue('permissions', currentValue)
  }

  const availablePredifined: { [label: string]: () => any } = {}
  for (const label in predifinedPermissions) {
    if (predifinedPermissions.hasOwnProperty(label)) {
      const perms = predifinedPermissions[label]
      if (!perms.filter(perm => !givablePermissions.includes(perm)).pop()) {
        availablePredifined[label] = () => setFieldValue('permissions', perms)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className='invite-member-form'>
      <ContentWithHeader header='Invite Members'>
        <div className='content'>
          <FormGroup
            label="User's Emails"
            labelFor='input-member-invite-emails'
            helperText={
              errors && errors.emails ? errors.emails : "Insert user's emails you want to invite separated by commas..."
            }
            intent={errors && errors.emails ? Intent.DANGER : Intent.NONE}
          >
            <TagInput
              placeholder='Separate email with commas...'
              rightElement={clearButton}
              onChange={setFieldValue.bind(null, 'emails')}
              values={values.emails}
              addOnBlur={true}
              addOnPaste={true}
              inputProps={{
                id: 'input-member-invite-emails',
                name: 'emails',
                autoFocus: true,
              }}
            />
          </FormGroup>

          <H4>Permissions</H4>
          <HTMLTable className='permission-table'>
            <tbody>
              {availablePredifined && (
                <tr>
                  <td colSpan={4}>
                    {lodash.keys(availablePredifined).map(pred => (
                      <Button key={pred} className='predifined-permission' onClick={availablePredifined[pred]}>
                        {pred}
                      </Button>
                    ))}
                  </td>
                </tr>
              )}
              {chucks.map((ch, i) => (
                <tr key={i}>
                  {ch.map(perm => {
                    const checked = values.permissions.includes(perm)
                    const disabled = !givablePermissions.includes(perm)
                    return (
                      <td key={perm}>
                        <Checkbox
                          name={perm}
                          checked={checked}
                          label={perm}
                          disabled={disabled}
                          onChange={handleChangePermission}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </HTMLTable>

          <Button type='submit' intent={Intent.SUCCESS} icon='new-person'>
            Invite
          </Button>
        </div>
      </ContentWithHeader>
    </form>
  )
}
