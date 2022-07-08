import { Field, ID, ObjectType } from "type-graphql";
import { Task } from "./Task";
import { User } from "./User";

@ObjectType()
export class Workspace {

    @Field(type => ID)
    id: number

    @Field()
    name: String

    @Field()
    owner: User

    @Field(type => [User])
    participants: User[]

    @Field(type => [Task])
    tasks: Task[]
}