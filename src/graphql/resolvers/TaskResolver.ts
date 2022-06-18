import { Arg, Args, ArgsType, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { IDArg } from "../args/IDArg";
import { Task } from "../types/Task";

@Resolver(Task)
export class TaskResolver {

    @Query(returns => Task)
    async task(
        @Arg("id", type => ID) id: number,
        @Ctx() context: any
    ) {
        return await context.prisma.task.findUnique({
            where: { id: Number(id) },
        })
    }

    @Mutation(returns => Task)
    async createTask(
        @Arg("title")
        title: string,
        @Arg("description")
        description: string,
        @Ctx()
        context: any
        
    ) {
        return await context.prisma.task.create({
            data: {
                title,
                description,
                isCompleted: false
            }
        })
    }

    @Query(returns => [Task])
    async tasks(
        @Arg("offset")
        offset: number, 
        @Arg("limit")
        limit: number,
        @Ctx()
        context: any
        ) {
            return await context.prisma.task.findMany({
                skip: offset,
                take: limit
            })
    }

    @Mutation(returns => Task)
    async updateTask(
        @Arg("id", type => ID) id: number,
        @Arg("title")
        title: string,
        @Arg("description", {nullable: true})
        description: string,
        @Ctx()
        context: any
    ) {
        return await context.prisma.task.update({
            where: { id: Number(id) },
            data: {
                title, 
                description
            }
        })
    }

    @Mutation(returns => Task)
    async toggleTaskStatus(
        @Arg("id", type => ID) id: number,
        @Ctx()
        context: any
    ) {
        let task = await context.prisma.task.findUnique({ where: { id: Number(id) } })

        return await context.prisma.task.update({
            where: { id: Number(id) },
            data: {
                isCompleted: !task.isCompleted,
                completedAt: task.isCompleted ? new Date(): null
            }
        })
    }
}