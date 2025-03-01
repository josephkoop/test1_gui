import express, { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { isReadable } from 'stream';

const tasksFile = path.join(process.cwd(), 'tasks.json');
const router = express.Router();

let tasks = [];

fs.readFile(tasksFile, 'utf8', (err, data) => {
    if(err){
        tasks = [
            {id: 1, title: 'Class Design', description: 'Design all classes that will be used in the project.', completed: 1},     //('task_id', 'title', 'description', 'completed')
            {id: 2, title: 'Database Design', description: 'Design the database for the project.', completed: 1}, 
            {id: 3, title: 'UI Design', description: 'Design the front-end for the project.', completed: 1}, 
            {id: 4, title: 'Coding', description: 'Code the classes, front-end, and database.', completed: 0}, 
            {id: 5, title: 'Implement Authorization', description: 'Figure out what authorazation to use and implement it.', completed: 0}, 
            {id: 6, title: 'Test the project', description: 'Make sure everything functions as intended.', completed: 0}, 
        ];
        return;
    }
    tasks = JSON.parse(data);
});

let task_id = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;

router.get('/', (req, res) => {
    res.render('home', {
        tasks
    });
});

router.post('/add-task', (req, res) => {
    const { title, description } = req.body;

    if(!title || !description){
        return res.status(400).send('Title and description are required');
    }

    tasks.push({id: task_id++, title: title, description: description, completed: 0})
    
    fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
        if(err){
            console.error("Failed to updated tasks.json:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/');
    });
});

router.get('/toggle-task/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const taskIndex = tasks.findIndex(task => task.id === id);

    if(taskIndex !== -1){
        tasks[taskIndex].completed = tasks[taskIndex].completed ? 0 : 1;

        fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
            if(err){
                console.error("Failed to update tasks.json:", err);
                return res.status(500).send("Internal Server Error");
            }
            res.redirect('/');
        });
    }
});

router.get('/delete-task/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    tasks = tasks.filter(task => task.id !== id);

    fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2), (err) => {
        if(err){
            console.error("Failed to update tasks.json:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.redirect('/');
    });
});

export default router;