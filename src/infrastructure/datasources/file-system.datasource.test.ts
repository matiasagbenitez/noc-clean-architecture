import fs from 'fs';
import path from 'path';
import { FileSystemDataSource } from './file-system.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';



describe('FileSystemDataSource', () => {

    const logPath = path.join(__dirname, '../../../logs')


    beforeEach(() => {
        fs.rmSync(logPath, { recursive: true, force: true });
    })

    test('should create log files if they do not exists', () => {

        new FileSystemDataSource();
        const files = fs.readdirSync(logPath);
        expect(files).toEqual(['all-logs.log', 'high-logs.log', 'low-logs.log', 'medium-logs.log'])


    })

    test('should save a log in all-logs.log', () => {

        const logDatasource = new FileSystemDataSource();
        const log = new LogEntity({
            message: 'test',
            level: LogSeverityLevel.LOW,
            origin: 'file-system.datasource.test.ts'
        });

        logDatasource.saveLog(log);
        const allLogs = fs.readFileSync(`${logPath}/all-logs.log`, 'utf-8');
        expect(allLogs).toContain(JSON.stringify(log));

    });

    test('should save a log in all-logs.log and medium-logs.log', () => {

        const logDatasource = new FileSystemDataSource();
        const log = new LogEntity({
            message: 'test',
            level: LogSeverityLevel.MEDIUM,
            origin: 'file-system.datasource.test.ts'
        });

        logDatasource.saveLog(log);
        const allLogs = fs.readFileSync(`${logPath}/all-logs.log`, 'utf-8');
        const mediumLogs = fs.readFileSync(`${logPath}/medium-logs.log`, 'utf-8');

        expect(allLogs).toContain(JSON.stringify(log));
        expect(mediumLogs).toContain(JSON.stringify(log));

    });

    test('should save a log in all-logs.log and high-logs.log', () => {

        const logDatasource = new FileSystemDataSource();
        const log = new LogEntity({
            message: 'test',
            level: LogSeverityLevel.HIGH,
            origin: 'file-system.datasource.test.ts'
        });

        logDatasource.saveLog(log);

        const allLogs = fs.readFileSync(`${logPath}/all-logs.log`, 'utf-8');
        const highLogs = fs.readFileSync(`${logPath}/high-logs.log`, 'utf-8');

        expect(allLogs).toContain(JSON.stringify(log));
        expect(highLogs).toContain(JSON.stringify(log));

    });


    test('should return all logs', async () => {

        const logDatasource = new FileSystemDataSource();
        const logLow = new LogEntity({
            message: 'log-low',
            level: LogSeverityLevel.LOW,
            origin: 'low'
        });
        const logMedium = new LogEntity({
            message: 'log-medium',
            level: LogSeverityLevel.MEDIUM,
            origin: 'medium'
        });

        const logHigh = new LogEntity({
            message: 'log-high',
            level: LogSeverityLevel.HIGH,
            origin: 'high'
        });

        await logDatasource.saveLog(logLow);
        await logDatasource.saveLog(logMedium);
        await logDatasource.saveLog(logHigh);

        const logsLow = await logDatasource.getLogs(LogSeverityLevel.LOW);
        const logsMedium = await logDatasource.getLogs(LogSeverityLevel.MEDIUM);
        const logsHigh = await logDatasource.getLogs(LogSeverityLevel.HIGH);

        // expect( logsLow ).toEqual( expect.arrayContaining([ logLow, logMedium, logHigh ]) )
        expect(logsMedium).toEqual(expect.arrayContaining([logMedium]))
        expect(logsHigh).toEqual(expect.arrayContaining([logHigh]))


    });


    test('should not throw an error if path exists', () => {

        new FileSystemDataSource();
        new FileSystemDataSource();

        expect(true).toBeTruthy();

    })
});