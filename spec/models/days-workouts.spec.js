import { Database } from '../../models/indexedDB/index.js'
import { faker } from 'https://cdn.jsdelivr.net/npm/@faker-js/faker@9.5.0/+esm';
import { uuidv4 } from '../../main.js'


describe("DayWorkout", function () {

    const dayWorkouts = [].sort((a, b) => a.name.localeCompare(b.name))
    const db = new Database("Test")

    beforeAll(async () => { })

    it("dayWorkout insert should create dayWorkout", async function () {
        const dayWorkout = {}
    });

    it("dayWorkout select_id should fetch dayWorkout", async function () {

    });

    it("dayWorkout select should fetch all dayWorkouts", async function () {

    });

    it("dayWorkout delete should delete dayWorkout", async function () {
        const dayWorkout = {}
    });
});