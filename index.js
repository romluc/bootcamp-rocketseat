const express = require('express');

const server = express();

server.use(express.json());

const projects = [
  { id: 1, title: 'New project_1', tasks: ['Task 01'] },
  { id: 2, title: 'New project_2', tasks: ['Task 02', 'Task 02-2'] },
  { id: 3, title: 'New project_3', tasks: ['Task 03'] },
  { id: 4, title: 'New project_4', tasks: ['Task 04'] }
];

let requestNumber = 0;

// Middlewares
// Global - Reqs counter and timer
server.use((req, res, next) => {
  requestNumber += 1;
  console.log(`Request #${requestNumber}:`);
  console.time(`Method: ${req.method}; URL: ${req.url}`);
  next();

  console.timeEnd(`Method: ${req.method}; URL: ${req.url}`);
});

// Local - Checking existence
function checkProjectExistence(req, res, next) {
  const { id } = req.params;
  const project = projects.some(item => item.id == id);

  if (!project) {
    return res.status(400).json({ error: 'project not found' });
  }
  return next();
}

// Methods
server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkProjectExistence, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(item => item.id == id);
  return res.json(projects[index]);
});

server.post('/projects', (req, res) => {
  const { id, title, tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

server.put('/projects/:id', checkProjectExistence, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(item => item.id == id);
  project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExistence, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(item => item.id == id);

  projects.splice(index, 1);

  return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExistence, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(item => item.id == id);

  project.tasks.push(title);

  return res.json(projects);
});

server.delete('/projects/:id/:task', checkProjectExistence, (req, res) => {
  const { id } = req.params;
  const { task } = req.params;

  const index = projects.findIndex(item => item.id == id);
  const { tasks } = projects[index];
  tasks.splice(task, 1);

  return res.json(projects);
});

server.listen(3000);
