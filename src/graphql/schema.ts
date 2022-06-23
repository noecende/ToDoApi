import { PubSub } from "graphql-subscriptions"
import { buildSchema } from "type-graphql"
import Container from "typedi"
import { AuthResolver } from "./resolvers/AuthResolver"
import { TaskResolver } from "./resolvers/TaskResolver"
import { UserResolver } from "./resolvers/UserResolver"

export const schema = buildSchema({
    resolvers: [TaskResolver, UserResolver, AuthResolver],
    pubSub: new PubSub(),
    dateScalarMode: "isoDate",
    container: Container
})
