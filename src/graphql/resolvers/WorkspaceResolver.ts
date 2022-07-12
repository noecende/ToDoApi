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

    @Mutation(returns => Workspace)
    @UseMiddleware(apiAuth)
    async updateWorkspace(@Args() {id, name}: UpdateWorkspaceArgs) {
        if(name) {
            return this.workspaceService.updateWorkspace(id, name)
        }

        return this.workspaceService.findById(id)
    }

    /**
     * @todo Implementar el resolver para eliminar workspace.
     */
    async deleteWorkspace(@Args() {id}: WorkspaceArgs) {
        
    }

    @FieldResolver(returns => [Task])
    async tasks(@Root() root: Workspace, @Args() {offset, limit}: PaginationArgs) {
       return this.taskService.findByWorkspace(root.id, offset, limit)
    }

    @FieldResolver(returns => [User])
    async participants(@Root() root: Workspace) {
        return this.workspaceService.getParticipants(root.id)
    }

    @FieldResolver(returns => User)
    async owner(@Root() root: Workspace) {
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