import { PrismaClient, Task as task} from "@prisma/client";
import { Inject, Service } from "typedi";

@Service()
export class TaskService {

    constructor(@Inject("prisma") private prisma: PrismaClient) {}

    public async findById(id: number): Promise<task> {
        return await this.prisma.task.findUnique({
            where: { id: Number(id) },
        })
    }

    public async findByWorkspace(workspaceId: number, offset: number, limit: number) {
        return this.prisma.workspace.findUnique({where: {id: workspaceId}}).tasks({skip: offset, take:limit})
    }

    /**
     * Crea una nueva tarea en la base de datos.
     * @param task - <Tarea> parcial
     * @returns La tarea que se creó.
     */
    public async create(task: Partial<task>): Promise<task> {
        return await this.prisma.task.create({
            data: {
                title: task.title,
                description: task.description,
                isCompleted: false,
                workspaceId: Number(task.workspaceId)
            },
        })
    }

    /**
     * "Actualizar una tarea por id con los datos proporcionados en el objeto de la tarea".
     * 
     * El primer argumento es el id de la tarea a actualizar. El segundo argumento son los datos a
     * actualizar.
     * @param {number} id - number - el id de la tarea a actualizar
     * @param task - Omitir<Parcial<Tarea>, 'id'>
     * @returns La tarea actualizada
     */
    public async update(id: number, task: Omit<Partial<task>, 'id'>): Promise<task> {
        return await this.prisma.task.update({
            data: task,
            where: {
                id: Number(id)
            }
        })
    }

    public async delete(id: number): Promise<task> {
        return await this.prisma.task.delete({where: {id: Number(id)}})
    }

    public async paginate(offset: number, limit: number): Promise<task[]> {
        return await this.prisma.task.findMany({
            skip: offset,
            take: limit,
        })
    }
}
