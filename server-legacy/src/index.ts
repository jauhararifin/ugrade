import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { LanguageEntity } from './entity/LanguageEntity'
import { GraphQLServer } from 'graphql-yoga'
import { buildSchema } from 'type-graphql'
import { LanguageResolver } from './resolvers/LanguageResolver'

async function bootstrap() {
  const connection = await createConnection()

  const language = new LanguageEntity()
  language.name = 'C++11'
  language.extensions = ['cpp', 'cxx', 'c++', 'cc']
  await connection.manager.save(language)

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
