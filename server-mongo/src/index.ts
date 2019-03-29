import { GraphQLServer } from 'graphql-yoga'

export let connection = undefined

async function bootstrap() {
  const server = new GraphQLServer({})
  server.start(() => console.log('Server is running on http://localhost:4000'))
}

bootstrap()
