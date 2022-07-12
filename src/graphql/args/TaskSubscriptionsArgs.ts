import { ArgsType, Field, ID } from "type-graphql";
import { Exists } from "../../rules/Exists";


@ArgsType()
export class TaskSubscriptionsArgs {

    @Field(type => ID)
    @Exists('Workspace', {message: "El espacio de trabajo no existe."})
    workspaceId: number
} 