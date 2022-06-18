import { buildSchema } from "type-graphql"
import { TaskResolver } from "./resolvers/TaskResolver"

export const schema = buildSchema({
    resolvers: [TaskResolver],
    dateScalarMode: "isoDate",
})
