import nodemailer from 'nodemailer';
import { EmailService, SendMailOptions } from './email-service';



describe('EmailService', () => {

    const mockSendMail = jest.fn();

    // Mock al createTransport
    nodemailer.createTransport = jest.fn().mockReturnValue({
        sendMail: mockSendMail
    });

    const emailSevice = new EmailService();


    test('should send email', async () => {


        const options: SendMailOptions = {
            to: 'fernando@google.com',
            subject: 'Test',
            htmlBody: '<h1>Test</h1>'
        };

        await emailSevice.sendEmail(options);

        expect(mockSendMail).toHaveBeenCalledWith({
            attachments: expect.any(Array),
            html: "<h1>Test</h1>",
            subject: "Test",
            to: "fernando@google.com",
        });

    });

    test('should send email with attachements', async () => {

        const email = 'fernando@google.com';
        await emailSevice.sendEmailWithFilesystemLogs(email);


        expect(mockSendMail).toHaveBeenCalledWith({
            to: email,
            subject: "Logs del servidor",
            html: expect.any(String),
            attachments: expect.arrayContaining([
                { filename: 'all-logs.log', path: 'logs/all-logs.log' },
                { filename: 'high-logs.log', path: 'logs/high-logs.log' },
                { filename: 'low-logs.log', path: 'logs/low-logs.log' },
                { filename: 'medium-logs.log', path: 'logs/medium-logs.log' }
            ])
        });



    });


});