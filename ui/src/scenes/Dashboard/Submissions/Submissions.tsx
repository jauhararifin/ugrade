import { useContestOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import { useServerClock } from '@/window'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { SimpleLoading } from '../components/SimpleLoading'
import { useBreadcrumb } from '../TopNavigationBar/Breadcrumbs/Breadcrumbs'
import { SubmissionsView } from './SubmissionsView'
import { GetMySubmissions } from './types/GetMySubmissions'

export const Submissions: FunctionComponent = () => {
  useContestOnly()
  useBreadcrumb(`/contest/submissions`, 'Submissions')
  const serverClock = useServerClock()

  const { data, loading, error } = useQuery<GetMySubmissions>(gql`
    query GetMySubmissions {
      submissions {
        id
        problem {
          id
          name
        }
        language {
          id
          name
        }
        verdict
        issuedTime
      }
    }
  `)

  console.log(error)

  if (loading || !serverClock) return <SimpleLoading />
  if (error || !data || !data.submissions) return <BasicError />

  return <SubmissionsView submissions={data.submissions} serverClock={serverClock} />
}
