import { Database } from '../../models/indexedDB/index.js'
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@9.5.0/+esm';

describe("Workout Exercises", function () {

    const categories = [
        {
            id: faker.string.uuid(),
            name: faker.string.alpha(10)
        }
    ]
    const workouts = [
        {
            id: faker.string.uuid(),
            name: faker.string.alpha(10),
        },
        {
            id: faker.string.uuid(),
            name: faker.string.alpha(10),
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
    const workoutExercises = [
        {
            id: faker.string.uuid(),
            exercise_id: exercises[0].id,
            workout_id: workouts[0].id,
        },
        {
            id: faker.string.uuid(),
            exercise_id: exercises[1].id,
            workout_id: workouts[0].id,
        },
        {
            id: faker.string.uuid(),
            exercise_id: exercises[0].id,
            workout_id: workouts[1].id,
        }
    ].sort((a, b) => a.id.localeCompare(b.id))
    const db = new Database("Test")

    beforeAll(async () => {
        await Promise.all(categories.map(async category => {
            await db.category.insert(db, category)
        }))
        await Promise.all(workouts.map(async workout => {
            await db.workout.insert(db, workout)
        }))
        await Promise.all(exercises.map(async exercise => {
            await db.exercise.insert(db, exercise)
        }))
        await Promise.all(workoutExercises.map(async workoutExercise => {
            await db.workoutExercise.insert(db, workoutExercise)
        }))
    })

    beforeEach(() => { })

    it("workoutExercise insert should create workoutExercise", async function () {
        const workoutExercise = {
            id: faker.string.uuid(),
            exercise_id: exercises[0].id,
            workout_id: workouts[1].id,
        }
        const response = await db.workoutExercise.insert(db, workoutExercise)
        expect(workoutExercise.id).toEqual(response)
    });

    it("workoutExercise select_id should fetch workoutExercise", async function () {
        const response = await db.workoutExercise.select_id(db, workoutExercises[0].id)
        expect(response).toEqual(workoutExercises[0])
    });

    it("workoutExercise select should fetch all workoutExercises", async function () {
        const response = await db.workoutExercise.select(db)
        const filteredworkoutExercises = response.filter(workoutExercise => workoutExercises.map(element => element.id).includes(workoutExercise.id))
        expect(filteredworkoutExercises).toEqual(workoutExercises)
    });

    it("workoutExercise delete should delete workoutExercise", async function () {
        const workoutExercise = {
            id: faker.string.uuid(),
            exercise_id: exercises[0].id,
            workout_id: workouts[1].id,
        }
        await db.workoutExercise.insert(db, workoutExercise)
        await db.workoutExercise.delete(db, workoutExercise.id)
        const response = await db.workoutExercise.select_id(db, workoutExercise.id)
        expect(response).toEqual(undefined)
    });
});