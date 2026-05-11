import express from 'express';
import { createProject, getProjects, getProjectById, addMemberToProject } from '../controllers/projectController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById);

router.route('/:id/members')
  .put(protect, admin, addMemberToProject);

export default router;
