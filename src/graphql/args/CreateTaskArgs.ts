import { ArgsType, Field } from "type-graphql";
import { Exists } from "../../rules/Exists";
import { Task } from "../types/Task";

@ArgsType()
export class CreateTaskArgs implements Partial<Task>{
    
    @Field()
    title: string

    @Field({nullable: true})
    description?: string

    @Field()
    @Exists('Workspace', {message: "El espacio de trabajo no existe."})
    workspaceId: number
} 