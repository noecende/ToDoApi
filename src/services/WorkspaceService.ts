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