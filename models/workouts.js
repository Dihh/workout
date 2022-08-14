import { db } from './index.js'

export const workoutTable = {
    select: () => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*
                FROM workouts a 
                `, [], (t, result) => { resolve([...result.rows]) })
            })
        })
    },
    selectWorkoutExercises: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.id, b.name, b.id as exercise_id
                FROM workouts_exercises a
                JOIN exercises b on a.exercise_id == b.id 
                WHERE a.workout_id = ?`, [id], (t, result) => { resolve([...result.rows]) }, (t, e) => console.log(e))
            })
        })
    },
    select_id: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*
                FROM workouts a 
                WHERE a.id = ?`, [id], (t, result) => { resolve(result.rows[0]) })
            })
        })
    },
    insert: (workout) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`INSERT INTO workouts (id, name) VALUES (?, ?)`, [workout.id, workout.name])
                resolve()
            })
        })
    },
    update: (workout) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`UPDATE workouts SET name = ? WHERE id = ?`, [workout.name, workout.id])
                resolve()
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`DELETE FROM workouts WHERE id = ?`, [id])
                resolve()
            })
        })
    },
}