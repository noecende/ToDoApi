import { PrismaClient, User, UsersOnWorkspaces, Workspace } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Inject, Service } from "typedi";

@Service()
export class WorkspaceService {
    constructor(
        @Inject("prisma") private prisma: PrismaClient,
        @Inject('pubSub') private pubsub: PubSub) {}

    public async findById(id: number): Promise<Workspace> {
        return await this.prisma.workspace.findUnique({where: {id: Number(id)}})
    }

    public async findByTask(taskId: number): Promise<Workspace> {
        return await this.prisma.task.findUnique({where: {id: taskId}}).workspace();
    }

    public async findByUser(userId: number): Promise<Workspace[]>{
        return (await this.prisma
                    .user
                    .findUnique({
                        where: {
                            id: Number(userId)
                        }
                    })
                    .workspaces({where: {role: 'owner'}, include: { workspace: true }}))
                    .map((workspace: UsersOnWorkspaces & {workspace: Workspace}) => {
                        return workspace.workspace
                    })
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

    public async addParticipant(userId: number, workspaceId: number): Promise<Workspace> {
        
        let usersOnWorskpaces = await this.prisma.usersOnWorkspaces.findUnique({
            where: {
                userId_workspaceId: {
                    userId: Number(userId),
                    workspaceId: Number(workspaceId)
                }
            },
            include: {
                workspace: true
            }
        })

        if(usersOnWorskpaces) {
            return usersOnWorskpaces.workspace
        }

        let workspace: Workspace = (
            await this.prisma
                        .usersOnWorkspaces
                        .create({
                            data: {
                                role: 'guest',
                                user: {
                                    connect: {id: Number(userId)}
                                },
                                workspace: {
                                    connect: {id: Number(workspaceId)}
                                }
                            },
                            include: {workspace: true}
                        })
            ).workspace

        this.pubsub.publish('WORKSPACE_UPDATED', workspace)
        return workspace
    }

    public async getParticipants(workspaceId: number) {
        return (await (this.prisma.workspace.findUnique({where: {id: workspaceId}}).participants({include: {user: true}}))).map(
            (relation: UsersOnWorkspaces & {user: User}) => {
                return relation.user
            }
        )
    }

    public async createWorkspace(name: string, userId: number) {
        let workspace: Workspace = await this.prisma.workspace.create({data: {
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

        this.pubsub.publish('WORKSPACE_CREATED', workspace)
        return workspace
    }

    public async updateWorkspace(id: number, name?: string) {
        return this.prisma.workspace.update({where: {id}, data: {name}})
    }

}