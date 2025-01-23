import { envs } from "../../config/plugins/envs.plugin"
import { MongoDatabase } from "./init"

describe('init MongoDB', () => {
    test('should init MongoDB', () => {
        MongoDatabase.connect({
            mongoUrl: envs.MONGO_URL,
            dbName: envs.MONGO_DB_NAME
        }).then(result => {
            expect(result).toBe(true)
        })
    })

    test('should throw error', () => {
        MongoDatabase.connect({
            mongoUrl: 'wrong-url',
            dbName: 'wrong-db-name'
        }).catch(error => {
            expect(error).toBeInstanceOf(Error)
        })
    })
})