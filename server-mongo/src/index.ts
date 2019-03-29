import { GraphQLServer } from 'graphql-yoga'
import * as mongoose from 'mongoose'
import { languageResolvers } from './language/resolvers'
import { resetLanguages } from './language/fixtures'
import { resetContests } from './contest/fixtures'
import { contestResolvers } from './contest/resolvers'
import { resetUsers } from './auth/fixtures'
import { userResolvers } from './user/resolvers'
import { MONGO_CONNECTION, SECRET } from './config'
import { authMiddleware } from './auth/middleware'

async function bootstrap() {
  await mongoose.connect(MONGO_CONNECTION, { useNewUrlParser: true })

  await resetLanguages()
  await resetContests()
  await resetUsers()

  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: [languageResolvers, contestResolvers, userResolvers],
    context: authMiddleware(SECRET),
  })

  server.express.use()

  server.start(() => console.log('Server is running on http://localhost:4000'))
}

bootstrap()
