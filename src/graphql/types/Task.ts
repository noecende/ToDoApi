import { Field, ID, ObjectType } from "type-graphql";
import { Workspace } from "./Workspace";

@ObjectType()
export class Task {

    @Field(type => ID)
    id: number

    @Field()
    title: string

    @Field({nullable: true})
    description?: string

    @Field({defaultValue: false})
    isCompleted: boolean

    @Field()
    date: Date

    @Field({nullable: true})
    completedAt?: Date

    @Field(type => Workspace, {nullable: true})
    workspace?: Workspace

}