const https = require('https');

const groq = (systemPrompt, userPrompt) => new Promise((resolve, reject) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return reject(new Error('GROQ_API_KEY not set'));

  const body = JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 2048
  });

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.error) return reject(new Error(`Groq error: ${json.error.message}`));
        const text = json.choices?.[0]?.message?.content;
        if (!text) return reject(new Error('Empty response from Groq'));
        resolve(text);
      } catch (e) { reject(e); }
    });
  });
  req.on('error', reject);
  req.write(body);
  req.end();
});

const extractJSON = (text) => {
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return JSON.parse(codeBlock[1].trim());
  const arrMatch = text.match(/(\[\s*\{[\s\S]*?\}\s*\])/);
  if (arrMatch) return JSON.parse(arrMatch[1]);
  const objMatch = text.match(/(\{[\s\S]*?\})/);
  if (objMatch) return JSON.parse(objMatch[1]);
  return JSON.parse(text.trim());
};

exports.suggestTasks = async (req, res) => {
  const { goal } = req.body;
  if (!goal) return res.status(400).json({ success: false, message: 'Goal is required' });

  const text = await groq(
    'You are a productivity expert. Always respond with valid JSON only, no explanation, no markdown.',
    `Generate exactly 5 actionable tasks for this goal: "${goal}".
Respond with ONLY a JSON array. Example:
[{"title":"Task name","description":"What to do","priority":"medium","dueDate":"2026-05-10T00:00:00.000Z"}]
Priority must be one of: low, medium, high, critical. DueDate within next 30 days.`
  );

  const tasks = extractJSON(text);
  res.status(200).json({ success: true, tasks });
};

exports.breakdownTask = async (req, res) => {
  const { taskTitle, taskDescription } = req.body;
  if (!taskTitle) return res.status(400).json({ success: false, message: 'Task title is required' });

  const text = await groq(
    'You are a project planning expert. Always respond with valid JSON only, no explanation, no markdown.',
    `Break down this task into 3-7 specific subtasks.
Task: ${taskTitle}
Description: ${taskDescription || 'none'}
Respond with ONLY a JSON array. Example:
[{"title":"Subtask name","completed":false}]`
  );

  const subtasks = extractJSON(text);
  res.status(200).json({ success: true, subtasks });
};

exports.prioritizeTask = async (req, res) => {
  const { taskTitle, taskDescription, dueDate } = req.body;
  if (!taskTitle) return res.status(400).json({ success: false, message: 'Task title is required' });

  const text = await groq(
    'You are a productivity expert. Always respond with valid JSON only, no explanation, no markdown.',
    `Analyze this task and suggest a priority level.
Title: ${taskTitle}
Description: ${taskDescription || 'none'}
Due: ${dueDate || 'not set'}
Respond with ONLY a JSON object. Example:
{"priority":"high","reason":"Short reason here"}
Priority must be one of: low, medium, high, critical.`
  );

  const result = extractJSON(text);
  res.status(200).json({ success: true, ...result });
};
