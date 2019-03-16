import { ApolloServer, gql } from 'apollo-server-express'
import express from 'express'
import { schema } from './schema'
import { createResolvers } from './resolvers'
import { AddressInfo } from 'net'
import { InMemoryContestStore } from './contest/store/inmemory'
import { contests as contestFixture } from './contest'

const contestStore = new InMemoryContestStore(contestFixture)

const resolvers = createResolvers(contestStore)

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
