import { UsersOnWorkspaces, Workspace as prismaWorkspace } from "@prisma/client";
import { Args, FieldResolver, Mutation, Resolver, Root } from "type-graphql";
import { Inject, Service } from "typedi";
import { UserService } from "../../services/UserService";
import { WorkspaceService } from "../../services/WorkspaceService";
import { CreateUserArgs } from "../args/user/CreateUserArgs";
import { User } from "../types/User";
import { Workspace } from "../types/Workspace";

@Service()
@Resolver(User)
export class UserResolver {

    @Inject() userService: UserService
    @Inject() workspaceService: WorkspaceService

    @Mutation(returns => User)
    async register(
        @Args() {name, lastname, email, password}: CreateUserArgs
    ) {
        return await this.userService.create({
            name,
            lastname,
            email
        }, password)
    }

    @FieldResolver()
    async workspaces(@Root() root: User): Promise<prismaWorkspace[]> {
        return this.workspaceService.findByUser(root.id)
    }
}