import { ArgsType, Field, ID } from "type-graphql";
import { Exists } from "../../../rules/Exists";
import { Workspace } from "../../types/Workspace";


@ArgsType()
export class WorkspaceArgs implements Partial<Workspace>{

    @Field(type => ID)
    @Exists('Workspace', {message: "El espacio de trabajo no existe."})
    id: number
} 