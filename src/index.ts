import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import dotenv from 'dotenv'
import {WebSocketServer} from 'ws'
import { schema } from './graphql/schema'
import express from 'express'
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { PubSub } from 'graphql-subscriptions'
import Container from 'typedi'
import { PrismaService } from './singletons/PrismaService'
import { useContainer } from 'class-validator'

const app = express()
dotenv.config()

async function bootstrap()
{
    const PORT = process.env.PORT || 4000;
    useContainer(Container, { fallbackOnErrors: true })
    const httpServer = createServer(app)
    const prismaClient = Container.get(PrismaService).prisma
    const pubSub = new PubSub()
    const schemaLoaded = await schema;
    
    const apolloServer = new ApolloServer({
        schema: await schema,
        context: () => {
          return {
            prisma: prismaClient,
            pubsub: pubSub
          }
        },
        introspection: true,
        cache: "bounded",
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
              async serverWillStart() {
                return {
                  async drainServer() {
                    await serverCleanup.dispose();
                  },
                };
              },
            },
          ],
    })

    await apolloServer.start()
    apolloServer.applyMiddleware({ app })

    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/subscriptions',
    })

    const serverCleanup = useServer({
      schema: schemaLoaded,
    }, wsServer);

    httpServer.listen(PORT, () => {
        console.log(`Server ready at port ${PORT}`)
    })
}

bootstrap()
