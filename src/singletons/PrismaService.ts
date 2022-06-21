import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

@Service()
export class PrismaServiceFactory {
    constructor(public prisma: PrismaClient) {}

    public build() {
        return new PrismaService(new PrismaClient())
    }
}

@Service( {factory: [PrismaServiceFactory, 'build']} )
export class PrismaService {
    constructor(public prisma: PrismaClient) {}
}

