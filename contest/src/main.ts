import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { schema } from './schema'
import { createResolvers } from './resolvers'
import { AddressInfo } from 'net'
import { InMemoryContestStore } from './contest/store/inmemory'
import { contests as contestFixture } from './contest'
import { InMemoryLanguageStore } from './language/store/inmemory'
import { availableLanguages as languageFixture } from './language'
import { InMemoryUserStore } from './user/store/inmemory'
import { users as userFixture } from './user'
import { InMemoryAuthStore } from './auth/store/inmemory'
import { credentials as authFixture } from './auth'

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

const apollo = new ApolloServer({ typeDefs: schema, resolvers })
const app = express()
apollo.applyMiddleware({ app })

const port = Number.parseInt(process.env.PORT || '5000')
const server = app.listen({ port }, () => {
  const addr = server.address() as AddressInfo
  console.log(
    `Server started at port: ${addr.address}:${addr.port}${apollo.graphqlPath}`
  )
})
