import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TaskContext = createContext();
export const useTasks = () => useContext(TaskContext);

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS': return { ...state, tasks: action.payload, loading: false };
    case 'ADD_TASK': return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK': return { ...state, tasks: state.tasks.map(t => t._id === action.payload._id ? action.payload : t) };
    case 'DELETE_TASK': return { ...state, tasks: state.tasks.filter(t => t._id !== action.payload) };
    case 'SET_STATS': return { ...state, stats: action.payload };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    default: return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, { tasks: [], stats: null, loading: false });

  const fetchTasks = useCallback(async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const params = new URLSearchParams(filters).toString();
    const { data } = await axios.get(`/api/tasks?${params}`);
    dispatch({ type: 'SET_TASKS', payload: data.tasks });
  }, []);

  const createTask = async (taskData) => {
    const { data } = await axios.post('/api/tasks', taskData);
    dispatch({ type: 'ADD_TASK', payload: data.task });
    toast.success('Task created!');
    return data.task;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await axios.put(`/api/tasks/${id}`, taskData);
    dispatch({ type: 'UPDATE_TASK', payload: data.task });
    toast.success('Task updated!');
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks/${id}`);
    dispatch({ type: 'DELETE_TASK', payload: id });
    toast.success('Task deleted!');
  };

  const fetchStats = useCallback(async () => {
    const { data } = await axios.get('/api/tasks/stats');
    dispatch({ type: 'SET_STATS', payload: data });
  }, []);

  return (
    <TaskContext.Provider value={{ ...state, fetchTasks, createTask, updateTask, deleteTask, fetchStats }}>
      {children}
    </TaskContext.Provider>
  );
};
