import { LogEntity, LogSeverityLevel } from "../entities/log.entity";

// Nos permite llamar métodos que se encuentran dentro del datasource
// Llegamos al datasource a través del repositorio
export abstract class LogRepository {
    abstract saveLog(log: LogEntity): Promise<void>;
    abstract getLogs(level: LogSeverityLevel): Promise<LogEntity[]>;
}