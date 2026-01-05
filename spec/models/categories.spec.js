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
    ].sort((a,b) => a.name.localeCompare(b.name))
    const db = new Database("Test")

    beforeAll(async () => {
        await Promise.all(categories.map(async category => {
            await db.category.insert(category, db)
        }))
    })

    beforeEach(() => {})

    it("category insert should create category", async function() {
        const category = {
            id: uuidv4(),
            name: faker.string.alpha(10)
        }
        const response = await db.category.insert(category, db)
        expect(category.id).toEqual(response)
    });

    it("category select_id should fetch category", async function() {
        const response = await db.category.select_id(categories[0].id, db)
        expect(response).toEqual(categories[0])
    });

    it("category select should fetch all categories", async function() {
        const response = await db.category.select(db)
        const filteredCategories = response.filter(category => categories.map(cat => cat.id).includes(category.id) ) 
        expect(filteredCategories).toEqual(categories)
    });

    it("category delete should delete category", async function() {
        const category = {
            id: uuidv4(),
            name: faker.string.alpha(10)
        }
        await db.category.insert(category, db)
        await db.category.delete(category.id, db)
        const response = await db.category.select_id(category.id, db)
        expect(response).toEqual(undefined)
    });
});