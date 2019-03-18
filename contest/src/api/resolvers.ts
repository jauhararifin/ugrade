import { GraphQLResolveInfo } from 'graphql'
import { MergeInfo } from 'graphql-tools'
import { AppContext } from 'ugrade/context'

export type AppFieldResolver<TSource = any, TArgs = any, TReturn = any> = (
  source: TSource,
  args: TArgs,
  context: AppContext,
  info: GraphQLResolveInfo & {
    mergeInfo: MergeInfo
  }
) => TReturn
