import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import { AddressInfo } from 'net'
import { createResolvers } from './api'
import { initializeConfig } from './config'
import { AppContext } from './context'
import { logger } from './logger'
import { schema } from './schema'

async function start() {
  dotenv.config()

  const {
    debug,
    authService,
    languageService,
    profileService,
    contestService,
    announcementService,
    clarificationService,
    problemService,
    submissionService,
  } = await initializeConfig()

  const resolvers = createResolvers(
    authService,
    languageService,
    profileService,
    contestService,
    announcementService,
    clarificationService,
    problemService,
    submissionService
  )

  const app = express()
  app.use(morgan('combined'))

  const apollo = new ApolloServer({
    typeDefs: schema,
    resolvers: resolvers as any,
    debug,
    context: ({ req }): AppContext => {
      let authToken
      if (req.headers.authorization) {
        const headerParts = req.headers.authorization.split(' ')
        if (headerParts[0].toLowerCase() === 'bearer') authToken = headerParts[1]
      }

      const requestIp = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '-').toString()
      const requestId = Math.round(Math.random() * 1000000).toString()

      return { authToken, requestId, requestIp }
    },
  })
  apollo.applyMiddleware({ app })

  const port = Number.parseInt(process.env.PORT || '5000', 10)
  const server = app.listen({ port }, () => {
    const addr = server.address() as AddressInfo
    logger.info(`Server started at port: ${addr.address}:${addr.port}${apollo.graphqlPath}`)
  })
}

start()
