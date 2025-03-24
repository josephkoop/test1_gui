//taskRoutes.js

import express, { Router } from 'express';
import path from 'path';
import fs from 'fs';

const tasksFile = path.join(process.cwd(), 'tasks.json'); // Path to the JSON file storing tasks
const router = express.Router();

let tasks = [];  // Array to store tasks
let sort = 'id'; // Default sorting method
let filter = 2;  // Default filter (2 likely means "All tasks")
let search = ''; // Default search query
let task_id = 1; // Initializing task ID



// Determine the next available task ID based on existing tasks
if(fs.existsSync('tasks.json')){
    const data = fs.readFileSync('tasks.json');
    tasks = JSON.parse(data);

    if(tasks.length > 0){
        task_id = Math.max(...tasks.map(task => task.id)) + 1;
    }
}

// Route for rendering the homepage with sorted tasks
router.get('/', (req, res) => {
    if(sort === 'pd'){
        tasks.sort((a, b) => a.priority - b.priority);
    }else if(sort === 'pa'){
        tasks.sort((a, b) => b.priority - a.priority);
    }else{
        tasks.sort((a, b) => a.id - b.id);
    }
    
    res.render('home', {
        tasks,
        selectedSort: sort,
        selectedFilter: filter,
        selectedSearch: ''
    });
});

// Route to add a new task
router.post('/add-task', (req, res) => {
    const { title, description, priority } = req.body;

    // Ensure required fields are present
    if(!title || !description || !priority){
        return res.status(400).send('Title, description, and priority are required');
    }

    // Add new task to the array
    tasks.push({id: task_id++, title: title, description: description, priority: priority, completed: 0});
    
    // Save tasks to file
    fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
        if(err){
            console.error("Failed to update tasks.json:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/');
    });
});

// Route to toggle task completion status
router.get('/toggle-task/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(task => task.id === id);

    if(taskIndex !== -1){
        tasks[taskIndex].completed = tasks[taskIndex].completed ? 0 : 1;

        // Save updated tasks to file
        fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
            if(err){
                console.error("Failed to update tasks.json:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect('/');
        });
    }
});

// Route to delete a task
router.get('/delete-task/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    tasks = tasks.filter(task => task.id !== id);

    // Save updated tasks to file
    fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
        if(err){
            console.error("Failed to update tasks.json:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/');
    });
});

// Route to set the sorting method
router.get('/sort', (req, res) => {
    sort = req.query.sort || 'id';
    res.redirect('/');
});

// Route to set the filter (e.g., completed, pending, or all)
router.get('/filter', (req, res) => {
    filter = parseInt(req.query.filter, 10);
    res.redirect('/');
});

// Route to handle searching by title
router.get('/search', (req, res) => {
    search = req.query.search || '';

    // Sort tasks again after updating search query
    if(sort === 'pd'){
        tasks.sort((a, b) => a.priority - b.priority);
    }else if(sort === 'pa'){
        tasks.sort((a, b) => b.priority - a.priority);
    }else{
        tasks.sort((a, b) => a.id - b.id);
    }
    
    res.render('home', {
        tasks,
        selectedSort: sort,
        selectedFilter: filter,
        selectedSearch: search
    });
});

export default router;