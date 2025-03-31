import { viewTasks, addTaskDB, toggleTaskDB, deleteTaskDB, editTaskDB } from "../models/taskModel.js";

export const home = async (req, res) => {
    try{
        const tasks = await viewTasks();
        res.render('home', {
            tasks
        });
    }catch(error){
        res.status(500).send("An error occured while fetching task list.")
    }
};

export const addTask = async (req, res) => {
    const { title, description, priority } = req.body;
    
    if(!title || !priority){            // Ensure required fields are present
        return res.status(400).send('Title and priority level are required.');
    }

    try{
        const newTask = await addTaskDB(title, description, priority);
        res.json({ res: newTask });
    }catch(error){
        res.status(500).json({ err: "An error occured while adding task." });
    }
};

export const editTask = async (req, res) => {
    const { id, title, description, priority } = req.body;
    
    if(!id) return res.status(400).send("Error: task not found");

    if(!title || !priority){            // Ensure required fields are present
        return res.status(400).send('Title and priority level are required.');
    }

    try{
        const editTask = await editTaskDB(id, title, description, priority);
        res.json({ res: editTask });
    }catch(error){
        res.status(500).json({ err: "An error occured while editing task." });
    }
};

export const toggleTask = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if(!id || isNaN(id)){
        return res.status(400).json({ err: "Invalid or missing ID" });
    }

    try{
        const updatedTask = await toggleTaskDB(id);
        res.json({ res: updatedTask });
    }catch(error){
        res.status(500).json({ err: "An error occured while updating task."});
    }
}

export const deleteTask = async (req, res) => {
    const id = parseInt(req.params.id, 10);

    if(!id || isNaN(id)){
        return res.status(400).json({ err: "Invalid or missing ID" });
    }

    try{
        const deletedTask = await deleteTaskDB(id);
        res.json({ res: deletedTask });
    }catch(error){
        res.status(500).json({ err: "An error occured while deleting task." });
    }
}




// if(sort === 'pd'){
//     tasks.sort((a, b) => a.priority - b.priority);
// }else if(sort === 'pa'){
//     tasks.sort((a, b) => b.priority - a.priority);
// }else{
//     tasks.sort((a, b) => a.id - b.id);
// }