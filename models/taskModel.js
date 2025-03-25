import { query } from "../config/db.js";

export const viewTasks = async () => {
    try{
        const result = await query("SELECT id, title, description, priority, completed FROM tasks");
        return result.rows;
    }catch(error){
        console.error("Error fetching tasks:", error);
        throw error;
    }
};

export const addTaskDB = async (title, description, priority) => {
    try{
        const result = await query(
            "INSERT INTO tasks (title, description, priority, completed) VALUES ($1, $2, $3, false) RETURNING *",
            [title, description, priority]
        );
        return result.rows[0];
    }catch(error){
        console.error("Error adding task:", error);
        throw error;
    }
};

























//let tasks = [];  // Array to store tasks