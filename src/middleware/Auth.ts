import { AuthenticationError } from "apollo-server-core";
import { GraphQLError } from "graphql";
import { MiddlewareFn } from "type-graphql";
import Container from "typedi";
import { AuthService } from "../services/AuthService";

export const apiAuth: MiddlewareFn = async ({ context, info }, next) => {
    if(!context["user"]) {
        throw new AuthenticationError('Usuario no autenticado.')
    }
    return next()
};