import { Arg, Mutation, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import { AuthService } from "../../services/AuthService";
import { ApiAuthentication } from "../types/ApiAuthentication";

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

}