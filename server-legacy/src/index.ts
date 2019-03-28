import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { GraphQLServer } from 'graphql-yoga'
import { buildSchema } from 'type-graphql'
import { LanguageResolver } from './language/LanguageResolver'
import { loadFixture } from '@/entity/fixtures'
import { ContestResolver } from './contest/ContestResolver'

export let connection = undefined

async function bootstrap() {
  connection = await createConnection()
  await loadFixture()

  const schema = await buildSchema({
    resolvers: [LanguageResolver, ContestResolver],
    emitSchemaFile: true,
  })

  const server = new GraphQLServer({
    schema,
  })

  server.start(() => console.log('Server is running on http://localhost:4000'))
}

bootstrap()
