import { PubSub } from "graphql-subscriptions"
import { buildSchema } from "type-graphql"
import Container from "typedi"
import { TaskResolver } from "./resolvers/TaskResolver"
import { UserResolver } from "./resolvers/UserResolver"

export const schema = buildSchema({
    resolvers: [TaskResolver, UserResolver],
    pubSub: new PubSub(),
    dateScalarMode: "isoDate",
    container: Container
})
