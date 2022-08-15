import { db } from './index.js'

export const workoutExerciseTable = {
    select: () => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*
                FROM workouts_exercises a 
                `, [], (t, result) => { resolve([...result.rows]) })
            })
        })
    },
    select_id: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*
                FROM workouts_exercises a 
                WHERE a.id = ?`, [id], (t, result) => { resolve(result.rows[0]) })
            })
        })
    },
    insert: (workout_exercise) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`INSERT INTO workouts_exercises (id, exercise_id, workout_id) VALUES (?, ?, ?)`, [workout_exercise.id, workout_exercise.exercise_id, workout_exercise.workout_id])
                resolve()
            })
        })
    },
    update: (workout_exercise) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`UPDATE workouts_exercises SET exercise_id = ?, workout_id = ? WHERE id = ?`, [workout_exercise.exercise_id, workout_exercise.workout_id, workout_exercise.id])
                resolve()
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`DELETE FROM workouts_exercises WHERE id = ?`, [id])
                resolve()
            })
        })
    },
}