import bcrypt from 'bcrypt';
import { PrismaClient, User } from "@prisma/client";
import { Inject, Service } from "typedi";
import { GraphQLError } from 'graphql';
import {sign} from 'jsonwebtoken';

interface credentials {
    email: string,
    password: string
}

@Service()
export class AuthService {

    @Inject("prisma") private prisma: PrismaClient

    async login(credentials: credentials) {
        let user: User = await this.prisma.user.findUnique({
            where: {
                email: credentials.email
            }
        })

        if(user && bcrypt.compareSync(credentials.password, user.password)) {
            
            let token = sign({
                id: user.id,
                name: user.name
            }, process.env.JWT_SECRET)

            return {
                user,
                token: token
            }
        }

        throw new GraphQLError('Credenciales inválidas')
    }

}