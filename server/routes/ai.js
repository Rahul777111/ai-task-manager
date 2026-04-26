const express = require('express');
const router = express.Router();
const { suggestTasks, breakdownTask, prioritizeTask } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/suggest', suggestTasks);
router.post('/breakdown', breakdownTask);
router.post('/prioritize', prioritizeTask);

module.exports = router;
