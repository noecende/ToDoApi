import { Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root, Subscription, UseMiddleware } from "type-graphql";
import { Inject, Service } from "typedi";
import { apiAuth } from "../../middleware/Auth";
import { TaskService } from "../../services/TaskService";
import { WorkspaceService } from "../../services/WorkspaceService";
import { CreateWorkspaceArgs } from "../args/workspace/CreateWorkspaceArgs";
import { WorkspaceArgs } from "../args/workspace/WorkspaceArgs";
import { Task } from "../types/Task";
import { Workspace } from "../types/Workspace";
import { User } from "../types/User";
import { PaginationArgs } from "../args/PaginationArgs";
import { UpdateWorkspaceArgs } from "../args/workspace/UpdateWorkspaceArgs";
import { AddParticipantArgs } from "../args/workspace/AddParticipantArgs";
import { UsersOnWorkspaces } from "@prisma/client";
import { UserService } from "../../services/UserService";

@Service()
@Resolver(Workspace)
export class WorkspaceResolver {

    constructor(
        @Inject() private workspaceService: WorkspaceService,
        @Inject() private taskService: TaskService,
        @Inject() private userService: UserService
        ) {}

    @Query(returns => Workspace)
    async workspace(@Args() {id}: WorkspaceArgs) {
        return this.workspaceService.findById(id)
    }

    @Mutation(returns => Workspace)
    @UseMiddleware(apiAuth)
    async createWorkspace(
        @Args() {name}: CreateWorkspaceArgs,
        @Ctx() ctx: any) {
        return this.workspaceService.createWorkspace(name, ctx.user.id)
    }

    @Mutation(returns => Workspace)
    @UseMiddleware(apiAuth)
    async updateWorkspace(@Args() {id, name}: UpdateWorkspaceArgs) {
        if(name) {
            return this.workspaceService.updateWorkspace(id, name)
        }

        return this.workspaceService.findById(id)
    }

    @Mutation(returns => Workspace)
    @UseMiddleware(apiAuth)
    async addParticipant(@Args() {userId, workspaceId}: AddParticipantArgs) {
        return this.workspaceService.addParticipant(userId, workspaceId)
    }

    @Mutation(returns => Workspace)
    @UseMiddleware(apiAuth)
    async deleteWorkspace(@Args() {id}: WorkspaceArgs) {
        return await this.workspaceService.deleteWorkspace(id)
    }

    @FieldResolver(returns => [Task])
    async tasks(@Root() root: Workspace, @Args() {offset, limit}: PaginationArgs) {
        if(root.tasks != null) {
            return root.tasks
        }  
        return this.taskService.findByWorkspace(root.id, offset, limit)
    }

    @FieldResolver(returns => [User])
    async participants(@Root() root: Workspace) {
        return this.workspaceService.getParticipants(root.id)
    }

    @FieldResolver(returns => User)
    async owner(@Root() root: Workspace & {tasks: Task[], participants: UsersOnWorkspaces[]}) {
        if(root.participants != null) {
            let userId = root.participants.find((user: UsersOnWorkspaces) => user.role == 'owner').userId
            return this.userService.findById(userId)
        }  
        return this.workspaceService.getOwner(root.id)
    }

    @Subscription({topics: "WORKSPACE_CREATED"})
    workspaceCreated(@Root() workspace: Workspace): Workspace {
        return workspace
    }

    @Subscription({topics: "WORKSPACE_UPDATED"})
    workspaceUpdated(@Root() workspace: Workspace): Workspace {
        return workspace
    }

}