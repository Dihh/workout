import { Database } from '../../models/indexedDB/index.js'
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@9.5.0/+esm';
import { uuidv4 } from '../../main.js'


describe("Workouts", function() {

    const workouts = [
        {
            id:  faker.string.uuid(),
            name: faker.string.alpha(10),
        },
        {
            id:  faker.string.uuid(),
            name: faker.string.alpha(10),
        }
    ].sort((a,b) => a.name.localeCompare(b.name))
    const db = new Database("Test")

    beforeAll(async () => {
        await Promise.all(workouts.map(async workout => {
            await db.workout.insert(db, workout)
        }))
    })

    beforeEach(() => {})

    it("workout insert should create workout", async function() {
        const workout = {
            id: uuidv4(),
            name: faker.string.alpha(10),
        }
        const response = await db.workout.insert(db, workout)
        expect(workout.id).toEqual(response)
    });

    it("workout select_id should fetch workout", async function() {
        const response = await db.workout.select_id(db, workouts[0].id)
        expect(response).toEqual(workouts[0])
    });

    it("workout select should fetch all workouts", async function() {
        const response = await db.workout.select(db)
        const filteredworkouts = response.filter(workout => workouts.map(wk => wk.id).includes(workout.id) ) 
        expect(filteredworkouts).toEqual(workouts)
    });

    it("workout delete should delete workout", async function() {
        const workout = {
            id: uuidv4(),
            name: faker.string.alpha(10)
        }
        await db.workout.insert(db, workout)
        await db.workout.delete(db, workout.id)
        const response = await db.workout.select_id(db, workout.id)
        expect(response).toEqual(undefined)
    });

    xit("workout selectWorkoutExercises should fetch workout exercises", async function() {
        const response = await db.workout.selectWorkoutExercises(db, workouts[0].id)
        expect(response).toEqual(workouts[0])
    });
});