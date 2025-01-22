import { LogSeverityLevel } from "../domain/entities/log.entity";
import { SendEmailLogs } from "../domain/use-cases";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";

const logRepository = new LogRepositoryImpl(
    // new FileSystemDataSource(),
    new MongoLogDatasource(),
);
const emailService = new EmailService();

export class Server {
    public static start() {

        console.log('Server started');

        // * -------- Monitoreo de una URL -------- *
        // const url = 'https://www.google.com';
        // CronService.createJob('*/5 * * * * *', () => {
        //     new CheckService(
        //         logRepository,
        //         undefined,
        //         undefined
        //     ).execute(url);
        // });

        // * -------- Mandar un email -------- *
        // emailService.sendEmail({
        //     to: 'matiasagbenitez@gmail.com',
        //     subject: 'Logs del sistema de monitoreo' + new Date().toISOString(),
        //     htmlBody: '<h1>Logs del sistema de monitoreo</h1>'
        // });
        // emailService.sendEmailWithFilesystemLogs(['matiasagbenitez@gmail.com']);
        // new SendEmailLogs(emailService, logRepository).execute(['matiasagbenitez@gmail.com', 'matias.benitez.mab@gmail.com']);

    }
}