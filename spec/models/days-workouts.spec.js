import { Database } from '../../models/indexedDB/index.js'
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@9.5.0/+esm';

describe("DayWorkout", function () {

    const categories = [
        {
            id: faker.string.uuid(),
            name: faker.string.alpha(10)
        }
    ]
    const exercises = [
        {
            id: faker.string.uuid(),
            name: faker.string.alpha(10),
            category_id: categories[0].id,
        },
        {
            id: faker.string.uuid(),
            name: faker.string.alpha(10),
            category_id: categories[0].id,
        }
    ]
    const dayWorkoutExercises = [
        {
            id: faker.string.uuid(),
            date: new Date("2026-01-01").toISOString().split("T")[0],
            exercise_id: exercises[0].id,
            weight: 0,
            executed: 0,
            exercise_name: exercises[0].name,
            category_name: categories[0].name
        },
        {
            id: faker.string.uuid(),
            date: new Date("2026-01-01").toISOString().split("T")[0],
            exercise_id: exercises[1].id,
            weight: 10,
            executed: 0,
            exercise_name: exercises[1].name,
            category_name: categories[0].name
        },
    ].sort((a, b) => a.exercise_name.localeCompare(b.exercise_name))
    const db = new Database("Test")

    beforeAll(async () => {
        await Promise.all(categories.map(async category => {
            await db.category.insert(db, category)
        }))
        await Promise.all(exercises.map(async exercise => {
            await db.exercise.insert(db, exercise)
        }))
        await Promise.all(dayWorkoutExercises.map(async dayWorkoutExercise => {
            await db.dayWorkout.insert(db, dayWorkoutExercise)
        }))
    })

    beforeEach(() => { })

    it("dayWorkoutExercise insert should create dayWorkoutExercise", async function () {
        const dayWorkoutExercise = {
            id: faker.string.uuid(),
            date: new Date("2026-01-01").toISOString().split("T")[0],
            exercise_id: exercises[1].id,
            weight: 10,
            executed: 0
        }
        const response = await db.dayWorkout.insert(db, dayWorkoutExercise)
        expect(dayWorkoutExercise.id).toEqual(response)
    });

    it("dayWorkoutExercise select_id should fetch dayWorkoutExercise", async function () {
        const response = await db.dayWorkout.select_id(db, dayWorkoutExercises[0].id)
        expect(response).toEqual(dayWorkoutExercises[0])
    });

    it("dayWorkoutExercise select should fetch all dayWorkoutExercises", async function () {
        const response = await db.dayWorkout.select(db)
        const filteredDayWorkoutExercises = response.filter(dayWorkoutExercise => dayWorkoutExercises.map(element => element.id).includes(dayWorkoutExercise.id))
        expect(filteredDayWorkoutExercises).toEqual(dayWorkoutExercises)
    });

    it("dayWorkoutExercise delete should delete dayWorkoutExercise", async function () {
        const dayWorkoutExercise = {
            id: faker.string.uuid(),
            date: new Date("2026-01-01").toISOString().split("T")[0],
            exercise_id: exercises[1].id,
            weight: 10,
            executed: 0,
            exercise_name: exercises[1].name,
            category_name: categories[0].name
        }
        await db.dayWorkout.insert(db, dayWorkoutExercise)
        await db.dayWorkout.delete(db, dayWorkoutExercise.id)
        const response = await db.dayWorkout.select_id(db, dayWorkoutExercise.id)
        expect(response).toEqual(undefined)
    });
});