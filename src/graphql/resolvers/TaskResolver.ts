import { PubSubEngine } from "graphql-subscriptions";
import { Arg, Args, Ctx, ID, Mutation, PubSub, Query, Resolver, Root, Subscription } from "type-graphql";
import { CreateTaskArgs } from "../args/CreateTaskArgs";
import { UpdateTaskArgs } from "../args/UpdateTaskArgs";
import { Task } from "../types/Task";

@Resolver(Task)
export class TaskResolver {

    @Query(returns => Task)
    async task(
        @Arg("id", type => ID)
        id: number,
        @Ctx() context: any
    ) {
        return await context.prisma.task.findUnique({
            where: { id: Number(id) },
        })
    }

    @Mutation(returns => Task)
    async createTask(
        @Args() {title, description}: CreateTaskArgs,
        @Ctx()
        context: any,
        @PubSub()
        pubsub: PubSubEngine
        
    ) {
        let task = await context.prisma.task.create({
            data: {
                title,
                description,
                isCompleted: false
            }
        })
        pubsub.publish('TASK_CREATED', task)
        return task;
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
    async deleteTask(
        @Arg("id", type => ID) id: number,
        @Ctx() context: any,
        @PubSub() pubsub: PubSubEngine
    ) {
        let task = await context.prisma.task.delete({
            where: {id: Number(id)}
        })

        pubsub.publish('TASK_DELETED', task)

        return task
    }

    @Mutation(returns => Task)
    async updateTask(
        @Args() {id, title, description}: UpdateTaskArgs,
        @Ctx() context: any,
        @PubSub() pubsub: PubSubEngine
    ) {
        let task = await context.prisma.task.update({
            where: { id: Number(id) },
            data: {
                title, 
                description
            }
        })
        pubsub.publish('TASK_UPDATED', task)
        return task
    }

    @Mutation(returns => Task)
    async toggleTaskStatus(
        @Arg("id", type => ID) id: number,
        @Ctx()
        context: any,
        @PubSub()
        pubsub: PubSubEngine
    ) {
        let task = await context.prisma.task.findUnique({ where: { id: Number(id) } })

        task = await context.prisma.task.update({
            where: { id: Number(id) },
            data: {
                isCompleted: !task.isCompleted,
                completedAt: task.isCompleted ? new Date(): null
            }
        })

        pubsub.publish('TASK_UPDATED', task)
        return task
    }

    @Subscription({topics: "TASK_CREATED"})
    taskCreated(@Root() task: Task): Task {
        return task
    }

    @Subscription({topics: "TASK_UPDATED"})
    taskUpdated(@Root() task: Task): Task {
        return task
    }

    @Subscription({topics: "TASK_DELETED"})
    taskDeleted(@Root() task: Task): Task {
        return task
    }
 
}