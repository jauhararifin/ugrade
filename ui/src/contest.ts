import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'

export function useCreateContest() {
  const mutate = useMutation(
    gql`
      mutation CreateContest($email: String!, $shortId: String!, $name: String!, $shortDescription: String!) {
        createContest(contest: { name: $name, shortId: $shortId, shortDescription: $shortDescription }, email: $email) {
          admin {
            id
            name
            username
            email
            permissions
          }
          contest {
            id
            name
            shortId
            shortDescription
            description
            startTime
            freezed
            finishTime
            permittedLanguages {
              id
              name
              extensions
            }
          }
        }
      }
    `,
    { errorPolicy: 'none' }
  )
  return ({
    email,
    shortId,
    name,
    shortDescription,
  }: {
    email: string
    shortId: string
    name: string
    shortDescription: string
  }) =>
    mutate({
      variables: {
        email,
        shortId,
        name,
        shortDescription,
      },
    })
}
