import { IsOptional, MaxLength, MinLength } from "class-validator";
import { ArgsType, Field } from "type-graphql";
import { Exists } from "../../../rules/Exists";

@ArgsType()
export class UpdateWorkspaceArgs {

    @Field()
    @Exists('Workspace', {message: "El espacio de trabajo no existe."})
    id: number

    @Field({nullable: true})
    @IsOptional()
    @MinLength(1)
    @MaxLength(255)
    name: string
}