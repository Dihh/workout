import { Database } from '../../models/indexedDB/index.js'

describe("Index", function() {
    it("Should create database", async function() {
        const db = new Database("Test")
        const connection = await db.connect()
        expect(connection.error).toBe(null)
        db.close()
    });

    xit("Should delete database", async function() {
        const db = new Database("Test")
        const event = await db.delete()
        expect(event.returnValue).toBe(true)
    });
});