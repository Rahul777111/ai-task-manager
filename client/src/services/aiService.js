import axios from 'axios';

export const suggestTasks = (goal) => axios.post('/api/ai/suggest', { goal });
export const breakdownTask = (taskTitle, taskDescription) => axios.post('/api/ai/breakdown', { taskTitle, taskDescription });
export const prioritizeTask = (taskTitle, taskDescription, dueDate) => axios.post('/api/ai/prioritize', { taskTitle, taskDescription, dueDate });
