import { GraphQLServer } from 'graphql-yoga'
import * as mongoose from 'mongoose'
import { languageResolvers } from './language/resolvers'
import { resetLanguages } from './language/fixtures'
import { resetContests } from './contest/fixtures'
import { contestResolvers } from './contest/resolvers'

async function bootstrap() {
  await mongoose.connect('mongodb://localhost:27017/ugrade', { useNewUrlParser: true })

  await resetLanguages()
  await resetContests()

  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: [languageResolvers, contestResolvers],
  })
  server.start(() => console.log('Server is running on http://localhost:4000'))
}

bootstrap()
