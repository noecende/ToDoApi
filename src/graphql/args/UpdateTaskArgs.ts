import { MaxLength } from "class-validator";
import { ArgsType, Field, ID } from "type-graphql";
import { Exists } from "../../rules/Exists";
import { Task } from "../types/Task";

@ArgsType()
export class UpdateTaskArgs implements Partial<Task> {
    
    @Field(type => ID)
    @Exists({message: "User does not exist."})
    id: number

    @Field({nullable: true})
    @MaxLength(255)
    title?: string

    @Field({nullable: true})
    description?: string
    
}