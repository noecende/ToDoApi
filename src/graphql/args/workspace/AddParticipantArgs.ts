import { ArgsType, Field, ID } from "type-graphql";
import { Exists } from "../../../rules/Exists";

@ArgsType()
export class AddParticipantArgs {

    @Field(type => ID)
    @Exists('User', { message: 'El usuario no existe.' })
    userId: number

    @Field(type => ID)
    @Exists('Workspace', { message: "El espacio de trabajo no existe." })
    workspaceId: number
}