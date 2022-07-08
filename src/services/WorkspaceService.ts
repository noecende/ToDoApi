import { PrismaClient, User, UsersOnWorkspaces, Workspace } from "@prisma/client";
import { Inject, Service } from "typedi";

@Service()
export class WorkspaceService {
    constructor(@Inject("prisma") private prisma: PrismaClient) {}

    public async findById(id: number): Promise<Workspace> {
        return await this.prisma.workspace.findUnique({where: {id: Number(id)}})
    }

    public async findByTask(taskId: number): Promise<Workspace> {
        return await this.prisma.task.findUnique({where: {id: taskId}}).workspace();
    }

    /**
     * Obtiene el propietario de un espacio de trabajo por workspaceId
     * @param {number} workspaceId - número
     * @returns {User} El usuario propietario del viaje.
     */
    public async getOwner(workspaceId: number): Promise<User> {

        let usersOnWorskpaces = await this.prisma
                            .workspace
                            .findUnique({ where: { id: workspaceId } })
                            .participants({ where: { role: 'owner' }, include: { user: true } })
                           
        return usersOnWorskpaces[0].user 
    }

    public async getParticipants(workspaceId: number) {
        return (await (this.prisma.workspace.findUnique({where: {id: workspaceId}}).participants({include: {user: true}}))).map(
            (relation: UsersOnWorkspaces & {user: User}) => {
                return relation.user
            }
        )
    }

    public async createWorkspace(name: string, userId: number) {
        return await this.prisma.workspace.create({data: {
            name,
            participants : {
                create: [{
                    role: 'owner', 
                    user: {
                        connect: { id: userId }
                    }
                }]
            }
        }})
    }
}