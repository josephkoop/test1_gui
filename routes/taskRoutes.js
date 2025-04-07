//taskRoutes.js

import express, { Router } from 'express';
import { home, addTask, toggleTask, deleteTask, editTask } from '../controllers/taskController.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/', home);                
router.post('/add-task', addTask);      
router.put('/edit-task/:id', editTask);  
router.patch('/toggle-task/:id', toggleTask);
router.delete('/delete-task/:id', deleteTask);

export default router;



//const tasksFile = path.join(process.cwd(), 'tasks.json'); // Path to the JSON file storing tasks

// let sort = 'id'; // Default sorting method
// let filter = 2;  // Default filter (2 likely means "All tasks")
// let search = ''; // Default search query
// let task_id = 1; // Initializing task ID

// Determine the next available task ID based on existing tasks
// if(fs.existsSync('tasks.json')){
//     const data = fs.readFileSync('tasks.json');
//     tasks = JSON.parse(data);

//     if(tasks.length > 0){
//         task_id = Math.max(...tasks.map(task => task.id)) + 1;
//     }
// }



// // Route to set the sorting method
// router.get('/sort', (req, res) => {
//     sort = req.query.sort || 'id';
//     res.redirect('/');
// });

// // Route to set the filter (e.g., completed, pending, or all)
// router.get('/filter', (req, res) => {
//     filter = parseInt(req.query.filter, 10);
//     res.redirect('/');
// });

// // Route to handle searching by title
// router.get('/search', (req, res) => {
//     search = req.query.search || '';

//     // Sort tasks again after updating search query
//     if(sort === 'pd'){
//         tasks.sort((a, b) => a.priority - b.priority);
//     }else if(sort === 'pa'){
//         tasks.sort((a, b) => b.priority - a.priority);
//     }else{
//         tasks.sort((a, b) => a.id - b.id);
//     }
    
//     res.render('home', {
//         tasks,
//         selectedSort: sort,
//         selectedFilter: filter,
//         selectedSearch: search
//     });
// });