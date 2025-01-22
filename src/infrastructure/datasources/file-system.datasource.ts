import * as fs from 'fs';

import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class FileSystemDataSource implements LogDataSource {

    private readonly logPath: string = 'logs/';
    private readonly allLogsPath: string = 'logs/all-logs.log';
    private readonly lowLogsPath: string = 'logs/low-logs.log';
    private readonly mediumLogsPath: string = 'logs/medium-logs.log';
    private readonly highLogsPath: string = 'logs/high-logs.log';

    constructor() {
        this.createLogsDirectory();
    }

    async saveLog(log: LogEntity): Promise<void> {
        const logString = JSON.stringify(log) + '\n';
        fs.appendFileSync(this.allLogsPath, `${logString}`);
        fs.appendFileSync(this.getLogPath(log.level), `${logString}`);
    }

    async getLogs(level: LogSeverityLevel): Promise<LogEntity[]> {
        switch (level) {
            case LogSeverityLevel.LOW:
                return this.getLogsFromFile(this.lowLogsPath);
            case LogSeverityLevel.MEDIUM:
                return this.getLogsFromFile(this.mediumLogsPath);
            case LogSeverityLevel.HIGH:
                return this.getLogsFromFile(this.highLogsPath);
            default:
                throw new Error(`${level} level not implemented`);
        }
    }

    private createLogsDirectory(): void {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath);
        }

        [this.allLogsPath, this.lowLogsPath, this.mediumLogsPath, this.highLogsPath].forEach((logPath) => {
            if (!fs.existsSync(logPath)) {
                fs.writeFileSync(logPath, '');
            }
        })
    }

    private getLogPath(level: LogSeverityLevel): string {
        switch (level) {
            case LogSeverityLevel.LOW:
                return this.lowLogsPath;
            case LogSeverityLevel.MEDIUM:
                return this.mediumLogsPath;
            case LogSeverityLevel.HIGH:
                return this.highLogsPath;
            default:
                return this.allLogsPath;
        }
    }

    private getLogsFromFile(path: string): LogEntity[] {
        const content = fs.readFileSync(path, 'utf-8');
        if (content.trim() === '') return [];
        return content.split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => LogEntity.fromJSON(line));
    }

}