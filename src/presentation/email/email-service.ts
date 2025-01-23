import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';

export interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

interface Attachment {
    filename: string;
    path: string;
}

export class EmailService {

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_MAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    });

    constructor() {
    }

    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const { to, subject, htmlBody: html, attachments = [] } = options;
        try {
            await this.transporter.sendMail({ to, subject, html, attachments });
            return true;
        } catch (error) {
            return false;
        }
    }

    sendEmailWithFilesystemLogs(to: string | string[]) {
        const subject = 'Logs del sistema de monitoreo ' + new Date().toISOString();
        const htmlBody = `
            <h1>Logs del sistema de monitoreo</h1>
            <p>Ad reprehenderit et pariatur consectetur consequat sunt.</p>
            <p>Ver logs adjuntos</p>
        `;
        const attachments = [
            { filename: 'all-logs.log', path: 'logs/all-logs.log' },
            { filename: 'high-logs.log', path: 'logs/high-logs.log' },
            { filename: 'low-logs.log', path: 'logs/low-logs.log' },
            { filename: 'medium-logs.log', path: 'logs/medium-logs.log' }
        ];

        return this.sendEmail({ to, subject, htmlBody, attachments });
    }

}