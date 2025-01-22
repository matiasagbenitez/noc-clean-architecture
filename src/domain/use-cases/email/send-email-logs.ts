import { EmailService } from "../../../presentation/email/email-service";
import { LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";

interface SendLogEmailUseCase {
    execute(to: string | string[]): Promise<boolean>;
}

export class SendEmailLogs implements SendLogEmailUseCase {

    constructor(
        private readonly emailService: EmailService,
        private readonly logRepository: LogRepository
    ) { }

    async execute(to: string | string[]): Promise<boolean> {
        try {
            const sent = await this.emailService.sendEmailWithFilesystemLogs(to);
            if (!sent) throw new Error('Failed to send email');

            await this.logRepository.saveLog({
                level: LogSeverityLevel.LOW,
                message: `Email with logs files sent to ${to}`,
                origin: 'send-email-logs.ts'
            });
            return true;
            
        } catch (error) {
            await this.logRepository.saveLog({
                level: LogSeverityLevel.HIGH,
                message: `Error sending email with logs files to ${to}`,
                origin: 'send-email-logs.ts'
            });
            return false;
        }
    }
}