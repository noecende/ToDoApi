import { Args, Mutation, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import { UserService } from "../../services/UserService";
import { CreateUserArgs } from "../args/user/CreateUserArgs";
import { User } from "../types/User";

@Service()
@Resolver(User)
export class UserResolver {

    @Inject() userService: UserService

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
}