import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class ApiAuthentication {

    @Field(type => User)
    user: User

    @Field()
    token: string
}