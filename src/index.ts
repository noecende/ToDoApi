import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import {createServer} from 'http'
import {WebSocketServer} from 'ws'
import { schema } from './graphql/schema'
import express from 'express'
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { PrismaClient } from '@prisma/client'

const app = express()

async function bootstrap()
{
    const PORT = process.env.port || 4000;
    const schemaLoaded = await schema;
    const httpServer = createServer(app)
    const context = {
      prisma: new PrismaClient({})
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
        path: '/subscriptions'
    })

    const serverCleanup = useServer({ schema: schemaLoaded }, wsServer);

    httpServer.listen(PORT, () => {
        console.log(`Server ready at port ${PORT}`)
    })
}

bootstrap()
