const express = require('express');
const router = express.Router();
const { getTasks, createTask, getTask, updateTask, deleteTask, getStats } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getTasks).post(createTask);
router.get('/stats', getStats);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
