import { Arg, Query, Resolver } from 'type-graphql'
import { Language } from '../schemas/Language'
import { LanguageEntity } from '../entity/LanguageEntity'

@Resolver(of => Language)
export class LanguageResolver {
  @Query(returns => Language!)
  async language(@Arg('id', { nullable: false }) id: string): Promise<Language> {
    return LanguageEntity.findOne(id)
  }

  @Query(returns => [Language!]!)
  async languages(): Promise<Language[]> {
    return LanguageEntity.find()
  }
}
