import { Field, ID, ObjectType } from "type-graphql"
import { Workspace } from "./Workspace"

@ObjectType()
export class User {

    @Field(type => ID)
    id: number

    @Field()
    name: string

    @Field()
    lastname: string

    @Field()
    email: string

    @Field()
    createdAt: Date

    @Field(type => [Workspace])
    workspaces: Workspace[]
}