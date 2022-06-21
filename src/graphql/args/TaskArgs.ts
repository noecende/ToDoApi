import { ArgsType, Field, ID } from "type-graphql";
import { Exists } from "../../rules/Exists";
import { Task } from "../types/Task";

@ArgsType()
export class TaskArgs implements Partial<Task> {
    
    @Field(type => ID)
    @Exists(
        'task',
        {message: "Task does not exist."})
    id: number
}