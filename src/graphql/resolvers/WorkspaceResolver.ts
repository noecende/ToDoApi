import { Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Inject, Service } from "typedi";
import { apiAuth } from "../../middleware/Auth";
import { TaskService } from "../../services/TaskService";
import { WorkspaceService } from "../../services/WorkspaceService";
import { CreateWorkspaceArgs } from "../args/workspace/CreateWorkspaceArgs";
import { WorkspaceArgs } from "../args/workspace/WorkspaceArgs";
import { Task } from "../types/Task";
import { Workspace } from "../types/Workspace";
import { User } from "../types/User";

@Service()
@Resolver(Workspace)
export class WorkspaceResolver {

    constructor(
        @Inject() private workspaceService: WorkspaceService,
        @Inject() private taskService: TaskService
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

    @FieldResolver(returns => [Task])
    async tasks(@Root() root: Workspace) {
       return this.taskService.findByWorkspace(root.id)
    }

    @FieldResolver(returns => [User])
    async participants(@Root() root: Workspace) {
        return this.workspaceService.getParticipants(root.id)
    }

    @FieldResolver(returns => User)
    async owner(@Root() root: Workspace) {
        return this.workspaceService.getOwner(root.id)
    }

}