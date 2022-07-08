import { Max, MaxLength, Min, MinLength } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class CreateWorkspaceArgs {

    @Field({nullable: false})
    @MinLength(1)
    @MaxLength(255)
    name: string
}