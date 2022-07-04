import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Inject, Service } from "typedi";
import { apiAuth } from "../../middleware/Auth";
import { AuthService } from "../../services/AuthService";
import { ApiAuthentication } from "../types/ApiAuthentication";
import { User } from "../types/User";

@Service()
@Resolver()
export class AuthResolver {

    @Inject() authService: AuthService

    @Mutation(returns => ApiAuthentication)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        return await this.authService.login({email, password})
    }

    @Query(returns => User)
    @UseMiddleware(apiAuth)
    async me(@Ctx() context: any) {
        return context.user
    }

}