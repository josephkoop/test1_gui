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

export const arrangeTaskDB = async (page, sort, filter, search) => {
    let column = 'id';
    let order = 'ASC';
    let status1 = true;
    let status2 = false;
    let limit = 5;
    let offset = limit * (page - 1);
    if(offset < 0 || offset % limit != 0){
        offset = 0;
    } 

    if(sort == 'pa'){
        column = 'priority';
        order = 'DESC';
    }else if(sort == 'pd'){
        column = 'priority';
    }

    if(filter == 1){
        status2 = true;
    }else if(filter == 2){
        status1 = false;
    }

    try{
        let queryText = `SELECT * FROM tasks 
            WHERE (completed = $1 OR completed = $2) 
            AND title ILIKE $3 
            ORDER BY ${column} ${order}
            LIMIT ${limit} OFFSET ${offset}
        `;
        const result = await query(
            queryText, [status1, status2, `%${search}%`]
        );
        const count = await query(
            "SELECT COUNT(*) FROM tasks WHERE (completed = $1 OR completed = $2) AND title ILIKE $3", [status1, status2, `%${search}%`]
        );
        const finalCount = parseInt(count.rows[0].count, 10);
        const isLast = finalCount <= (offset + result.rows.length);
        return {tasks: result.rows, isLast: isLast};
    }catch(error){
        console.error("Error fetching tasks");
        throw error;
    }
}













