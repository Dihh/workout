import { Database } from '../../models/indexedDB/index.js'
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@9.5.0/+esm';
import { uuidv4 } from '../../main.js'


describe("Categories", function() {

    const categories = [
        {
            id:  faker.string.uuid(),
            name: faker.string.alpha(10)
        },
        {
            id:  faker.string.uuid(),
            name: faker.string.alpha(10)
        }
    ]

    beforeAll(async () => {
        const db = new Database("Test")
        await Promise.all(categories.map(async category => {
            await db.category.insert(category, db)
        }))
    })

    it("category insert should create category", async function() {
        const db = new Database("Test")
        const category = {
            id: uuidv4(),
            name: faker.string.alpha(10)
        }
        const response = await db.category.insert(category, db)
        expect(category.id).toEqual(response)
    });

    it("category select_id should fetch category", async function() {
        const db = new Database("Test")
        const response = await db.category.select_id(categories[0].id, db)
        expect(response).toEqual(categories[0])
    });

    it("category select should fetch all categories", async function() {
        const db = new Database("Test")
        const response = await db.category.select(db)
        expect(response).toEqual(categories)
    });
});