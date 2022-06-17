import { GraphQLSchema } from "graphql"
import { buildSchema } from "type-graphql"
import { RecipeResolver } from "./resolvers/RecipeResolver"

export const schema = buildSchema({
    resolvers: [RecipeResolver],
})