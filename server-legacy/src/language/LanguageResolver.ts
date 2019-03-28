import { Arg, Query, Resolver } from 'type-graphql'
import { Language } from './Language'
import { LanguageEntity } from '@/entity/LanguageEntity'
import { ApolloError } from 'apollo-server-core'

@Resolver(of => Language)
export class LanguageResolver {
  @Query(returns => Language!)
  async language(@Arg('id', { nullable: false }) id: number): Promise<Language> {
    const lang = await LanguageEntity.findOne(id)
    if (lang) return lang
    throw new ApolloError('NoSuchLanguage', 'No Such Language')
  }

  @Query(returns => [Language!]!)
  async languages(): Promise<Language[]> {
    return LanguageEntity.find()
  }
}
