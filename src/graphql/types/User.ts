import { Field, ID, ObjectType } from "type-graphql"

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
}