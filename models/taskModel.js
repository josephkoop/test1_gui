import { query } from "../config/db.js";

export const viewTasks = async () => {
    try{
        const result = await query("SELECT id, title, description, priority, completed FROM tasks ORDER BY id ASC");
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

export const editTaskDB = async (id, title, description, priority) => {
    try{
        const task = await query(
            "SELECT * FROM tasks WHERE id = $1 LIMIT 1", [id]
        );

        if(task.rows.length !== 0){
            const result = await query(
                "UPDATE tasks SET title = $1, description = $2, priority = $3 WHERE id = $4 RETURNING *",
                [title, description, priority, id]
            );
            return result.rows[0];
        }else{
            throw new Error("Task not found.");
        }
    }catch(error){
        console.error("Error editing task:", error);
        throw error;
    }
};

export const toggleTaskDB = async (task_id) => {
    try{
        const task = await query(
            "SELECT * FROM tasks WHERE id = $1 LIMIT 1", [task_id]
        );

        if(task.rows.length !== 0){
            const result = await query(
                "UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *", [task_id]
            );
            return result.rows[0];
        }else{
            throw new Error("Task not found.");
        }
    }catch(error){
        console.error("Error updating task:", error);
        throw error;
    }
};

export const deleteTaskDB = async (task_id) => {
    try{
        const task = await query(
            "SELECT * FROM tasks WHERE id = $1 LIMIT 1", [task_id]
        );

        if(task.rows.length !== 0){
            const result = await query(
                "DELETE FROM tasks WHERE id = $1 RETURNING *", [task_id]
            );
            return result.rows[0];
        }else{
            throw new Error("Task not found.");
        }
    }catch(error){
        console.error("Error deleting task:", error);
        throw error;
    }
};















