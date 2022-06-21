import { ArgsType, Field } from "type-graphql";
import { Task } from "../types/Task";

@ArgsType()
export class CreateTaskArgs implements Partial<Task>{
    
    @Field()
    title: string

    @Field({nullable: true})
    description?: string
} 