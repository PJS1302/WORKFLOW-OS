const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Department = require('./models/Department');
const WorkflowTemplate = require('./models/WorkflowTemplate');
const Workflow = require('./models/Workflow');
const Request = require('./models/Request');
const Notification = require('./models/Notification');
const File = require('./models/File');
const AuditLog = require('./models/AuditLog');

const seedData = async () => {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/workflow_os');
    console.log('Connected to Database. Clearing existing data...');

    // Clear collections
    await User.deleteMany();
    await Department.deleteMany();
    await WorkflowTemplate.deleteMany();
    await Workflow.deleteMany();
    await Request.deleteMany();
    await Notification.deleteMany();
    await File.deleteMany();
    await AuditLog.deleteMany();

    console.log('Collections cleared. Creating departments...');

    // 1. Create Departments
    const hrDept = await Department.create({
      name: 'Human Resources',
      description: 'Handles personnel, onboarding, and leaves'
    });

    const engDept = await Department.create({
      name: 'Engineering',
      description: 'Handles product development and engineering'
    });

    const finDept = await Department.create({
      name: 'Finance',
      description: 'Handles purchase requests, payroll, and reimbursements'
    });

    console.log('Departments created. Creating users...');

    // 2. Create Users
    // Admin user (no department assigned initially)
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@workflow.com',
      password: 'admin123',
      role: 'admin',
      position: 'IT Administrator'
    });

    // Managers for HR, Eng, Fin
    const hrManager = await User.create({
      name: 'Sarah Jenkins',
      email: 'hr_manager@workflow.com',
      password: 'manager123',
      role: 'manager',
      position: 'HR Director',
      department: hrDept._id
    });

    const engManager = await User.create({
      name: 'John Doe',
      email: 'manager@workflow.com',
      password: 'manager123',
      role: 'manager',
      position: 'Engineering Manager',
      department: engDept._id
    });

    const finManager = await User.create({
      name: 'Robert C',
      email: 'fin_manager@workflow.com',
      password: 'manager123',
      role: 'manager',
      position: 'Chief Financial Officer',
      department: finDept._id
    });

    // Employees
    const hrEmployee = await User.create({
      name: 'Emma Watson',
      email: 'hr_emp@workflow.com',
      password: 'employee123',
      role: 'employee',
      position: 'HR Assistant',
      department: hrDept._id
    });

    const engEmployee = await User.create({
      name: 'Alice Smith',
      email: 'employee@workflow.com',
      password: 'employee123',
      role: 'employee',
      position: 'Software Engineer',
      department: engDept._id
    });

    const finEmployee = await User.create({
      name: 'Charlie Brown',
      email: 'fin_emp@workflow.com',
      password: 'employee123',
      role: 'employee',
      position: 'Accountant',
      department: finDept._id
    });

    // Update departments with head references
    hrDept.head = hrManager._id;
    await hrDept.save();

    engDept.head = engManager._id;
    await engDept.save();

    finDept.head = finManager._id;
    await finDept.save();

    console.log('Users created. Creating workflow templates...');

    // 3. Create Workflow Templates
    const templates = [
      {
        name: 'Standard Leave Request Template',
        type: 'Leave Request',
        description: 'Template for requesting personal, sick, or annual leave.',
        steps: [
          { name: 'Manager Review', approverRole: 'manager', order: 1 },
          { name: 'HR Department Log', approverRole: 'admin', order: 2 }
        ]
      },
      {
        name: 'Hardware Purchase Request Template',
        type: 'Purchase Request',
        description: 'Template for requesting laptop, monitor, or work hardware.',
        steps: [
          { name: 'Direct Manager Review', approverRole: 'manager', order: 1 },
          { name: 'Finance Admin Approval', approverRole: 'admin', order: 2 }
        ]
      },
      {
        name: 'Business Travel Approval Template',
        type: 'Travel Request',
        description: 'Template for request travel permission and accommodation.',
        steps: [
          { name: 'Department Head Review', approverRole: 'manager', order: 1 },
          { name: 'Operations Approval', approverRole: 'admin', order: 2 }
        ]
      },
      {
        name: 'Expense Reimbursement Template',
        type: 'Reimbursement Request',
        description: 'Template for reimbursement requests on work expenses.',
        steps: [
          { name: 'Manager Expense Check', approverRole: 'manager', order: 1 },
          { name: 'Accounts Admin Approval', approverRole: 'admin', order: 2 }
        ]
      },
      {
        name: 'NDA Document Approval Template',
        type: 'Document Approval',
        description: 'Template for NDA or legal contract review.',
        steps: [
          { name: 'Legal Manager Review', approverRole: 'manager', order: 1 }
        ]
      },
      {
        name: 'General Purpose Request Template',
        type: 'General Approval',
        description: 'Generic workflow template for miscellaneous approvals.',
        steps: [
          { name: 'Supervisor Review', approverRole: 'manager', order: 1 }
        ]
      }
    ];

    for (const t of templates) {
      await WorkflowTemplate.create(t);
    }

    console.log('Workflow templates created. Creating active workflows...');

    // 4. Create active workflows corresponding to templates for testing
    const createdTemplates = await WorkflowTemplate.find();
    for (const ct of createdTemplates) {
      await Workflow.create({
        name: ct.name.replace('Template', 'Workflow'),
        template: ct._id,
        type: ct.type,
        description: ct.description,
        steps: ct.steps
      });
    }

    console.log('Database seeded successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Seeder failed:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
