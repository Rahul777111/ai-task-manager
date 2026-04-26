const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const { status, priority, search, sort = '-createdAt' } = req.query;
  const query = { user: req.user._id };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) query.title = { $regex: search, $options: 'i' };
  const tasks = await Task.find(query).sort(sort);
  res.status(200).json({ success: true, count: tasks.length, tasks });
};

exports.createTask = async (req, res) => {
  req.body.user = req.user._id;
  const task = await Task.create(req.body);
  res.status(201).json({ success: true, task });
};

exports.getTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.status(200).json({ success: true, task });
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.status(200).json({ success: true, task });
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.status(200).json({ success: true, message: 'Task deleted' });
};

exports.getStats = async (req, res) => {
  const stats = await Task.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const overdue = await Task.countDocuments({
    user: req.user._id, dueDate: { $lt: new Date() }, status: { $ne: 'completed' }
  });
  res.status(200).json({ success: true, stats, overdue });
};
