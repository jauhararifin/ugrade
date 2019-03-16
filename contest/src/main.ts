import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import express from 'express'
import { AddressInfo } from 'net'
import { credentials as authFixture } from './auth/store'
import { InMemoryAuthStore } from './auth/store/inmemory'
import { contests as contestFixture } from './contest/store'
import { InMemoryContestStore } from './contest/store/inmemory'
import { AppContext } from './context'
import { availableLanguages as languageFixture } from './language/store'
import { InMemoryLanguageStore } from './language/store/inmemory'
import { createResolvers } from './resolvers'
import { schema } from './schema'
import { users as userFixture } from './user/store'
import { InMemoryUserStore } from './user/store/inmemory'

dotenv.config()

const contestStore = new InMemoryContestStore(contestFixture)
const languageStore = new InMemoryLanguageStore(languageFixture)
const userStore = new InMemoryUserStore(userFixture)
const authStore = new InMemoryAuthStore(authFixture)

const resolvers = createResolvers(
  contestStore,
  languageStore,
  userStore,
  authStore
)

const apollo = new ApolloServer({
  typeDefs: schema,
  resolvers,
  debug: process.env.NODE_ENV !== 'production',
  context: ({ req }): AppContext => {
    let authToken
    if (req.headers.authorization) {
      const headerParts = req.headers.authorization.split(' ')
      if (headerParts[0].toLowerCase() === 'bearer') authToken = headerParts[1]
    }
    return { authToken }
  },
})
const app = express()
apollo.applyMiddleware({ app })

const port = Number.parseInt(process.env.PORT || '5000', 10)
const server = app.listen({ port }, () => {
  const addr = server.address() as AddressInfo
  console.log(
    `Server started at port: ${addr.address}:${addr.port}${apollo.graphqlPath}`
  )
})
