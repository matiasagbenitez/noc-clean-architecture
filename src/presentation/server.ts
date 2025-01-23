import { SendEmailLogs, CheckService, CheckServiceMultiple } from "../domain/use-cases";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";

// Datasources
import { FileSystemDataSource, MongoLogDatasource, PostgresLogDatasource } from "../infrastructure/datasources";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";

// Implementación de los repositorios
const fsLogRepository = new LogRepositoryImpl(new FileSystemDataSource());
const mongoLogRepository = new LogRepositoryImpl(new MongoLogDatasource());
const postgresLogRepository = new LogRepositoryImpl(new PostgresLogDatasource());

const emailService = new EmailService();

export class Server {
    public static async start() {

        console.log('Server started');

        // * -------- Monitoreo de una URL -------- *
        const url = 'https://www.google.com';
        // CronService.createJob('*/15 * * * * *', () => {
        //     new CheckService(
        //         logRepository,
        //         undefined,
        //         undefined
        //     ).execute(url);
        // });
        CronService.createJob('*/15 * * * * *', () => {
            new CheckServiceMultiple(
                [fsLogRepository, mongoLogRepository, postgresLogRepository],
                undefined,
                undefined
            ).execute(url);
        });

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