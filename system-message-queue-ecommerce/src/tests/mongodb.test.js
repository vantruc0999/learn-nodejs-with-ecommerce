"use strict";

const mongoose = require("mongoose");

// const {
//     db: { host, port, user, password, dbName },
// } = require("../configs/config.mongo");

const connectString = `mongodb://root:123456@localhost:27019/ecommerce?authSource=admin`;
// const connectString = `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`;

const TestSchema = new mongoose.Schema({ name: String })
const Test = mongoose.model('Test', TestSchema)

describe('Mongoose Connection', () => {
    let connection

    beforeAll(async () => {
        connection = await mongoose.connect(connectString)
    })

    afterAll(async () => {
        await connection.disconnect()
    })

    it('should connect to mongoose', () => {
        expect(mongoose.connection.readyState).toBe(1)
    })

    it('should save a document to the database', async () => {
        const user = new Test({ name: 'Truc hehe' })
        await user.save()
        expect(user.isNew).toBe(false)
    })

    it("should find a document in the database", async () => {
        const user = await Test.findOne({ name: "Truc hehe" });
        expect(user).toBeDefined();
        expect(user.name).toBe("Truc hehe");
    });
})