import { ArgsType, Field, ID } from "type-graphql";

@ArgsType()
export class IDArg {
    @Field(type => ID)
    id: number
}