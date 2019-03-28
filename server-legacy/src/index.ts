import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { GraphQLServer } from 'graphql-yoga'
import { buildSchema } from 'type-graphql'
import { LanguageResolver } from './language/LanguageResolver'
import { loadFixture } from '@/entity/fixtures'

async function bootstrap() {
  await createConnection()
  await loadFixture()

  const schema = await buildSchema({
    resolvers: [LanguageResolver],
    emitSchemaFile: true,
  })

  const server = new GraphQLServer({
    schema,
  })

  server.start(() => console.log('Server is running on http://localhost:4000'))
}

bootstrap()
