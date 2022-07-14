import { PrismaClient, User } from "@prisma/client";
import { Inject, Service } from "typedi";

import { hashPassword } from "../utils/PasswordHash";

@Service()
export class UserService {

    @Inject("prisma") private prisma: PrismaClient

    public async create(user: Partial<User>, password: string) {
       return await this.prisma.user.create(
        {
            data: {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                password: await hashPassword(password)
            }})
    }

    public async findById(id: number) {
        return await this.prisma.user.findUnique({where: {
            id: Number(id)
        }})
    }

    /**
     * Buscar usuarios por nombre o apellido
     * @param {string} search 
     * @returns Usuarios que coincidan con la búsqueda.
     */
    public async searchUsers(search: string): Promise<User[]> {
        return this.prisma.user.findMany({
            where: {
                name: { search: search },
                lastname: {search: search}
            }
        })
    }

}