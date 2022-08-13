import { db } from './index.js'

export const dayWorkoutTable = {
    select: () => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*, b.name as exercise_name,  c.name as category_name, c.id as category_id
                FROM days_workouts a 
                JOIN exercises b on a.exercise_id == b.id
                JOIN categories c on b.category_id == c.id
                `, [], (t, result) => {
                    resolve([...result.rows])
                })
            }, (e) => { })
        })
    },
    select_between_date: (initial_date, final_date) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*, b.name as exercise_name,  c.name as category_name, c.id as category_id
                FROM days_workouts a 
                JOIN exercises b on a.exercise_id == b.id
                JOIN categories c on b.category_id == c.id
                WHERE a.date BETWEEN ? AND ?
                `, [initial_date, final_date], (t, result) => {
                    resolve([...result.rows])
                })
            }, (e) => { })
        })
    },
    select_id: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`SELECT a.*, b.name as exercise_name, c.name as category_name, c.id as category_id
                FROM days_workouts a 
                JOIN exercises b on a.exercise_id == b.id 
                JOIN categories c on b.category_id == c.id 
                WHERE a.id = ?`, [id], (t, result) => { resolve(result.rows[0]) })
            })
        })
    },
    insert: (workout) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`INSERT INTO days_workouts (id, date, exercise_id, weight) VALUES (?, ?, ?, ?)`, [workout.id, workout.date, workout.exercise_id, workout.weight])
                resolve()
            })
        })
    },
    update: (workout) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`UPDATE days_workouts SET date = ?, exercise_id = ?, weight = ?, executed = ? WHERE id = ?`, [workout.date, workout.exercise_id, workout.weight, workout.executed, workout.id])
                resolve()
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`DELETE FROM days_workouts WHERE id = ?`, [id])
                resolve()
            })
        })
    },
}