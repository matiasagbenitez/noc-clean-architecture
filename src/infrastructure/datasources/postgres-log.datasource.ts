import { PrismaClient } from "@prisma/client";
import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient();

export class PostgresLogDatasource implements LogDataSource {
    async saveLog(log: LogEntity): Promise<void> {
        await prismaClient.logModel.create({ data: { ...log } });
    }

    async getLogs(level: LogSeverityLevel): Promise<LogEntity[]> {
        const logs = await prismaClient.logModel.findMany({ where: { level } });
        return logs.map(log => LogEntity.fromObject(log));
    }
}