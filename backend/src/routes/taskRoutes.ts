import express from 'express';
import { createTask, getTasksByProject, updateTaskStatus, deleteTask, updateTask } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createTask);

router.route('/project/:projectId')
  .get(protect, getTasksByProject);

router.route('/:id/status')
  .put(protect, updateTaskStatus);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
