import { db } from './index.js'

export const categoria_table = {
    select: () => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql('SELECT * FROM categories', [], (t, result) => { resolve([...result.rows]) })
            })
        })
    },
    select_id: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql('SELECT * FROM categories WHERE id = ?', [id], (t, result) => { resolve(result.rows[0]) })
            })
        })
    },
    insert: (category) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`INSERT INTO categories (id, name) VALUES (?, ?)`, [category.id, category.name])
                resolve()
            })
        })
    },
    update: (category) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`UPDATE categories SET name = ? WHERE id = ?`, [category.name, category.id])
                resolve()
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve) => {
            db.transaction(t => {
                t.executeSql(`DELETE FROM categories WHERE id = ?`, [id])
                resolve()
            })
        })
    },
}