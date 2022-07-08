import { PubSub } from "graphql-subscriptions"
import { buildSchema } from "type-graphql"
import Container from "typedi"
import { AuthResolver } from "./resolvers/AuthResolver"
import { TaskResolver } from "./resolvers/TaskResolver"
import { UserResolver } from "./resolvers/UserResolver"
import { WorkspaceResolver } from "./resolvers/WorkspaceResolver"

export const schema = buildSchema({
    resolvers: [TaskResolver, UserResolver, AuthResolver, WorkspaceResolver],
    pubSub: new PubSub(),
    dateScalarMode: "isoDate",
    container: Container
})
