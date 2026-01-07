import { Database } from '../../models/indexedDB/index.js'
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@9.5.0/+esm';

describe("Exercises", function() {

    const categories = [
        {
            id:  faker.string.uuid(),
            name: faker.string.alpha(10)
        }
    ]

    const exercises = [
        {
            id:  faker.string.uuid(),
            name: faker.string.alpha(10),
            category_id: categories[0].id,
            category_name: categories[0].name,
        },
        {
            id:  faker.string.uuid(),
            name: faker.string.alpha(10),
            category_id: categories[0].id,
            category_name: categories[0].name,
        }
    ].sort((a,b) => a.name.localeCompare(b.name))
    const db = new Database("Test")

    beforeAll(async () => {
        await Promise.all(categories.map(async category => {
            await db.category.insert(db, category)
        }))
        await Promise.all(exercises.map(async exercise => {
            await db.exercise.insert(db, exercise)
        }))
    })

    beforeEach(() => {})

    it("exercise insert should create exercise", async function() {
        const exercise = {
            id: faker.string.uuid(),
            name: faker.string.alpha(10),
            category_id: exercises[0].id,
        }
        const response = await db.exercise.insert(db, exercise)
        expect(exercise.id).toEqual(response)
    });

    it("exercise select_id should fetch exercise", async function() {
        const response = await db.exercise.select_id(db, exercises[0].id)
        expect(response).toEqual(exercises[0])
    });

    it("exercise select should fetch all exercises", async function() {
        const response = await db.exercise.select(db)
        const filteredexercises = response.filter(exercise => exercises.map(exec => exec.id).includes(exercise.id) ) 
        expect(filteredexercises).toEqual(exercises)
    });

    it("exercise delete should delete exercise", async function() {
        const exercise = {
            id: faker.string.uuid(),
            name: faker.string.alpha(10)
        }
        await db.exercise.insert(db, exercise)
        await db.exercise.delete(db, exercise.id)
        const response = await db.exercise.select_id(db, exercise.id)
        expect(response).toEqual(undefined)
    });
});