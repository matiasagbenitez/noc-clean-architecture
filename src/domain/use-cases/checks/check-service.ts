import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";

interface CheckServiceUseCase {
    execute(url: string): Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {

    constructor(
        private readonly logRepository: LogRepository,
        private successCallback: SuccessCallback,
        private errorCallback: ErrorCallback
    ) { }

    async execute(url: string): Promise<boolean> {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch ${url}`);
            this.logRepository.saveLog(new LogEntity({
                level: LogSeverityLevel.LOW,
                message: `Service ${url} is working`,
                origin: 'check-service.ts'
            }));
            this.successCallback && this.successCallback();
            return true;
        } catch (error) {
            this.logRepository.saveLog(new LogEntity({
                level: LogSeverityLevel.HIGH,
                message: `Service ${url} is down`,
                origin: 'check-service.ts'
            }));
            this.errorCallback && this.errorCallback(`${error}`);
            return false;
        }
    }

}