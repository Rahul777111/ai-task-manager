const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.suggestTasks = async (req, res) => {
  const { goal } = req.body;
  if (!goal) return res.status(400).json({ success: false, message: 'Goal is required' });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'You are a productivity expert. Generate 5 actionable tasks for the given goal. Return JSON array with fields: title, description, priority (low/medium/high/critical), dueDate (ISO string, within next 30 days).'
    }, {
      role: 'user', content: `Generate tasks for: ${goal}`
    }],
    temperature: 0.7,
  });

  const tasks = JSON.parse(completion.choices[0].message.content);
  res.status(200).json({ success: true, tasks });
};

exports.breakdownTask = async (req, res) => {
  const { taskTitle, taskDescription } = req.body;
  if (!taskTitle) return res.status(400).json({ success: false, message: 'Task title is required' });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'Break down the given task into 3-7 specific subtasks. Return JSON array with fields: title (string), completed (false).'
    }, {
      role: 'user', content: `Task: ${taskTitle}\nDescription: ${taskDescription || ''}`
    }],
    temperature: 0.5,
  });

  const subtasks = JSON.parse(completion.choices[0].message.content);
  res.status(200).json({ success: true, subtasks });
};

exports.prioritizeTask = async (req, res) => {
  const { taskTitle, taskDescription, dueDate } = req.body;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{
      role: 'system',
      content: 'Analyze the task and suggest a priority level. Return JSON: { priority: "low"|"medium"|"high"|"critical", reason: string }'
    }, {
      role: 'user',
      content: `Title: ${taskTitle}\nDescription: ${taskDescription || ''}\nDue: ${dueDate || 'not set'}`
    }],
    temperature: 0.3,
  });

  const result = JSON.parse(completion.choices[0].message.content);
  res.status(200).json({ success: true, ...result });
};
