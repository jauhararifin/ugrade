import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { GraphQLServer } from 'graphql-yoga'
import { buildSchema } from 'type-graphql'
import { LanguageResolver } from './language/LanguageResolver'
import { loadFixture } from '@/entity/fixtures'
import { debug } from 'util'
import { UserResolver } from './user/UserResolver'
import { ContestResolver } from '@/contest/ContestResolver'

export let connection = undefined

async function bootstrap() {
  debug('create connection')
  connection = await createConnection()
  debug('connection established')

  debug('loading fixture')
  await loadFixture()
  debug('fixture loaded')

  const schema = await buildSchema({
    resolvers: [LanguageResolver, ContestResolver, UserResolver],
    emitSchemaFile: true,
  })

  const server = new GraphQLServer({
    schema,
  })

  server.start(() => console.log('Server is running on http://localhost:4000'))
}

bootstrap()
