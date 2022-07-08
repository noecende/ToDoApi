import { AuthenticationError } from "apollo-server-core";
import { MiddlewareFn } from "type-graphql";

export const apiAuth: MiddlewareFn = async ({ context, info }, next) => {
    if(!context["user"]) {
        throw new AuthenticationError('Usuario no autenticado.')
    }
    return next()
};