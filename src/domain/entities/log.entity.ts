export enum LogSeverityLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export interface LogEntityOptions {
    level: LogSeverityLevel;
    message: string;
    origin: string;
    createdAt?: Date;
}

export class LogEntity {

    public level: LogSeverityLevel;
    public message: string;
    public origin: string;
    public createdAt?: Date;

    constructor(options: LogEntityOptions) {
        const { level, message, origin, createdAt = new Date() } = options;
        this.level = level;
        this.message = message;
        this.origin = origin;
        this.createdAt = createdAt;
    }

    static fromJSON(json: string): LogEntity {
        json = (json === '') ? '{}' : json;
        const { message, level, origin, createdAt } = JSON.parse(json);
        if (!message || !level || !createdAt) throw new Error('Invalid JSON');
        return new LogEntity({ level, message, origin });
    }

    static fromObject(obj: { [key: string]: any }): LogEntity {
        const { message, level, origin, createdAt } = obj;
        // if (!message || !level || !createdAt) throw new Error('Invalid object');
        return new LogEntity({ level, message, origin, createdAt });
    }
}