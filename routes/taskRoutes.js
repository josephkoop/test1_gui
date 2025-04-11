//taskRoutes.js

import express, { Router } from 'express';
import { home, addTask, toggleTask, deleteTask, editTask, arrangeTask } from '../controllers/taskController.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get('/', home);                
router.post('/add-task', addTask);      
router.put('/edit-task/:id', editTask);  
router.patch('/toggle-task/:id', toggleTask);
router.delete('/delete-task/:id', deleteTask);
router.post('/arrange-task', arrangeTask);

export default router;