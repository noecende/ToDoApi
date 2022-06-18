import { PubSub } from "graphql-subscriptions"
import { buildSchema } from "type-graphql"
import { TaskResolver } from "./resolvers/TaskResolver"

export const schema = buildSchema({
    resolvers: [TaskResolver],
    pubSub: new PubSub(),
    dateScalarMode: "isoDate",
})
