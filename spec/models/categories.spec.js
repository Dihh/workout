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
            await db.category.insert(db, category)
        }))
    })

    beforeEach(() => {})

    it("category insert should create category", async function() {
        const category = {
            id: uuidv4(),
            name: faker.string.alpha(10)
        }
        const response = await db.category.insert(db, category)
        expect(category.id).toEqual(response)
    });

    it("category select_id should fetch category", async function() {
        const response = await db.category.select_id(db, categories[0].id)
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
        await db.category.insert(db, category)
        await db.category.delete(db, category.id)
        const response = await db.category.select_id(db, category.id)
        expect(response).toEqual(undefined)
    });
});