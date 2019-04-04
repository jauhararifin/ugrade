import { useContestOnly } from '@/auth'
import { BasicError } from '@/components/BasicError/BasicError'
import gql from 'graphql-tag'
import React, { FunctionComponent } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { SimpleLoading } from '../components/SimpleLoading'
import { OverviewView } from './OverviewView'
import { GetContestOverview } from './types/GetContestOverview'

export const Overview: FunctionComponent = () => {
  useContestOnly()

  const { data, error, loading } = useQuery<GetContestOverview>(
    gql`
      query GetContestOverview {
        myContest {
          id
          description
        }
      }
    `
  )
  if (loading) return <SimpleLoading />
  if (error) return <BasicError />
  if (!data) return <BasicError />
  return <OverviewView contest={data.myContest} />
}
