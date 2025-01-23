import mongoose from "mongoose"
import { envs } from "../../../config/plugins/envs.plugin"
import { MongoDatabase } from "../init"
import { LogModel } from "./log.model"

describe('get LogModel', () => {

    beforeAll(async () => {
        await MongoDatabase.connect({
            mongoUrl: envs.MONGO_URL,
            dbName: envs.MONGO_DB_NAME
        })
    })

    test('should get LogModel', () => {
        expect(LogModel).toBeDefined()
    })

    test('should create and return a LogModel', async () => {
        const logData = {
            message: 'Testing create log',
            level: 'LOW',
            origin: 'log.model.test.ts',
            createdAt: new Date()
        }

        const log = await LogModel.create(logData)

        expect(log).toBeDefined()
        expect(log.message).toBe(logData.message)
        expect(log.level).toBe(logData.level)
        expect(log.origin).toBe(logData.origin)

        await LogModel.findByIdAndDelete(log.id);
    })

    test('should return the schema object', () => {
        const schema = LogModel.schema.obj;

        // expect(schema).toEqual(expect.objectContaining(
        //     {
        //         message: { type: expect.any(Function) },
        //         origin: { type: expect.any(Function) },
        //         level: {
        //             type: expect.any(Function),
        //             enum: ['LOW', 'MEDIUM', 'HIGH'],
        //             default: 'LOW',
        //             required: true
        //         },
        //         createdAt: expect.any(Object)
        //     }
        // ))

    })

    afterAll(async () => {
        mongoose.connection.close()
    })
})