import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

dotenv.config();

export const seedData = async () => {
  try {
    // Check if demo admin already exists
    const adminExists = await User.findOne({ email: 'admin@flow.com' });
    if (adminExists) {
      console.log('Demo data already exists, skipping seed.');
      return;
    }

    console.log('Seeding database with demo data...');

    // Create Admin User
    const admin = await User.create({
      name: 'Demo Admin',
      email: 'admin@flow.com',
      password: 'password123',
      role: 'Admin',
    });
    console.log('Admin user created: admin@flow.com / password123');

    // Create Member User
    const member = await User.create({
      name: 'Demo Member',
      email: 'member@flow.com',
      password: 'password123',
      role: 'Member',
    });
    console.log('Member user created: member@flow.com / password123');

    // Create Project
    const project = await Project.create({
      name: 'FlowSphere Launch',
      description: 'The primary project for launching our new SaaS platform.',
      admin: admin._id,
      members: [admin._id, member._id],
    });
    console.log('Demo project created.');

    // Create Tasks
    await Task.create([
      {
        title: 'Design Hero Section',
        description: 'Create a glassmorphism hero section for the landing page.',
        priority: 'High',
        status: 'In Progress',
        assignedTo: admin._id,
        project: project._id,
        createdBy: admin._id,
      },
      {
        title: 'API Authentication',
        description: 'Implement JWT authentication and RBAC middleware.',
        priority: 'Urgent',
        status: 'Completed',
        assignedTo: admin._id,
        project: project._id,
        createdBy: admin._id,
      },
      {
        title: 'Mobile App Layout',
        description: 'Draft the responsive mobile layout for the dashboard.',
        priority: 'Medium',
        status: 'Todo',
        assignedTo: member._id,
        project: project._id,
        createdBy: admin._id,
      },
    ]);
    console.log('Demo tasks created.');
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
