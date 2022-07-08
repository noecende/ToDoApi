import { PubSubEngine } from "graphql-subscriptions";
import { Arg, Args, FieldResolver, ID, Mutation, PubSub, Query, Resolver, Root, Subscription, UseMiddleware } from "type-graphql";
import { Inject, Service } from "typedi";
import { apiAuth } from "../../middleware/Auth";
import { TaskService } from "../../services/TaskService";
import { CreateTaskArgs } from "../args/CreateTaskArgs";
import { PaginationArgs } from "../args/PaginationArgs";
import { TaskArgs } from "../args/TaskArgs";
import { UpdateTaskArgs } from "../args/UpdateTaskArgs";
import { Task } from "../types/Task";
import { Task as TaskModel } from "@prisma/client";
import { WorkspaceService } from "../../services/WorkspaceService";
import { Workspace } from "../types/Workspace";

@Service()
@Resolver(Task)
export class TaskResolver {

    constructor(
        @Inject() private taskService: TaskService,
        @Inject() private workspaceService: WorkspaceService
    
    ) {}

    @FieldResolver(returns => Workspace)
    async workspace(@Root() task: TaskModel) {
        return this.workspaceService.findByTask(task.id)
    }

    @Query(returns => Task)
    async task(
        @Args() {id}: TaskArgs
    ) {
        return await this.taskService.findById(id)
    }

    @Mutation(returns => Task)
    @UseMiddleware(apiAuth)
    async createTask(
        @Args() {title, description, workspaceId}: CreateTaskArgs,
        @PubSub()
        pubsub: PubSubEngine
        
    ) {
        let task = await this.taskService.create({
            title: title,
            description: description,
            workspaceId: workspaceId
        })
        pubsub.publish('TASK_CREATED', task)
        return task;
    }

    @Query(returns => [Task])
    @UseMiddleware(apiAuth)
    async tasks(@Args() {offset, limit}: PaginationArgs) {
            return await this.taskService.paginate(offset, limit)
    }

    @Mutation(returns => Task)
    @UseMiddleware(apiAuth)
    async deleteTask(
        @Args() {id}: TaskArgs,
        @PubSub() pubsub: PubSubEngine
    ) {
        let task = await this.taskService.delete(id)

        pubsub.publish('TASK_DELETED', task)

        return task
    }

    @Mutation(returns => Task)
    @UseMiddleware(apiAuth)
    async updateTask(
        @Args() {id, title, description}: UpdateTaskArgs,
        @PubSub() pubsub: PubSubEngine
    ) {
        let task = await this.taskService.update(id, {
                title, 
                description
        })
        pubsub.publish('TASK_UPDATED', task)
        return task
    }

    @Mutation(returns => Task)
    @UseMiddleware(apiAuth)
    async toggleTaskStatus(
        @Arg("id", type => ID) id: number,
        @PubSub()
        pubsub: PubSubEngine
    ) {
        let task = await this.taskService.findById(id)

        task = await this.taskService.update(id, {
            isCompleted: !task.isCompleted,
            completedAt: task.isCompleted ? new Date(): null
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