import { Response } from 'express';
import { Project } from '../models/Project';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, members } = req.body;

    const project = new Project({
      name,
      description,
      admin: req.user._id,
      members: members || [],
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Return projects where user is either the admin OR a member
    const query = {
      $or: [
        { admin: req.user._id },
        { members: req.user._id }
      ]
    };

    const projects = await Project.find(query).populate('admin', 'name email').populate('members', 'name email');
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id).populate('admin', 'name email').populate('members', 'name email');

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private/Admin
export const addMemberToProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { memberId } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      if (project.admin.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized, only admin can add members' });
        return;
      }

      if (project.members.includes(memberId)) {
        res.status(400).json({ message: 'Member already in project' });
        return;
      }

      project.members.push(memberId);
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
