import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { createServer } from 'http'
import dotenv from 'dotenv'
import {WebSocketServer} from 'ws'
import { schema } from './graphql/schema'
import express from 'express'
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { PrismaClient } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'

const app = express()
dotenv.config()

async function bootstrap()
{
    const PORT = process.env.PORT || 4000;
    const schemaLoaded = await schema;
    const httpServer = createServer(app)
    const context = {
      prisma: new PrismaClient({}),
      pubsub: new PubSub()
    }
    const apolloServer = new ApolloServer({
        schema: await schema,
        context,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),
      
            // Proper shutdown for the WebSocket server.
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
