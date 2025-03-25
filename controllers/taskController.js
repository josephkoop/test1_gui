import { viewTasks, addTaskDB } from "../models/taskModel.js";

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
        res.redirect('/');
    }catch(error){
        res.status(500).send("An error occured while adding task.");
    }
};



// const updateTask = (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     const taskIndex = tasks.findIndex(task => task.id === id);

//     if(taskIndex !== -1){
//         tasks[taskIndex].completed = tasks[taskIndex].completed ? 0 : 1;

//         // Save updated tasks to file
//         fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
//             if(err){
//                 console.error("Failed to update tasks.json:", err);
//                 return res.status(500).send("Internal Server Error");
//             }
//             res.redirect('/');
//         });
//     }
// }

// const deleteTask = (req, res) => {
//     const id = parseInt(req.params.id, 10);
//     tasks = tasks.filter(task => task.id !== id);

//     // Save updated tasks to file
//     fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
//         if(err){
//             console.error("Failed to update tasks.json:", err);
//             return res.status(500).send("Internal Server Error");
//         }
//         res.redirect('/');
//     });
// }




// if(sort === 'pd'){
//     tasks.sort((a, b) => a.priority - b.priority);
// }else if(sort === 'pa'){
//     tasks.sort((a, b) => b.priority - a.priority);
// }else{
//     tasks.sort((a, b) => a.id - b.id);
// }