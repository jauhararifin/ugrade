import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'

export function useSubmitSolution() {
  const mutate = useMutation(
    gql`
      mutation SubmitSolution($problemId: ID!, $languageId: ID!, $sourceCode: Upload!) {
        submitSolution(problemId: $problemId, languageId: $languageId, sourceCode: $sourceCode) {
          id
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: gql`
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
                sourceCode
                verdict
                issuedTime
              }
            }
          `,
        },
      ],
    }
  )
  return (problemId: string, languageId: string, sourceCode: File) =>
    mutate({
      variables: { problemId, languageId, sourceCode },
    })
}
