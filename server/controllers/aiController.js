const https = require('https');

const gemini = (prompt) => new Promise((resolve, reject) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return reject(new Error('GEMINI_API_KEY not set'));

  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) return reject(new Error('Empty response from Gemini'));
        resolve(text);
      } catch (e) { reject(e); }
    });
  });
  req.on('error', reject);
  req.write(body);
  req.end();
});

const extractJSON = (text) => {
  const match = text.match(/```(?:json)?\n?([\s\S]*?)```/) || text.match(/(\[\s*\{[\s\S]*\}\s*\]|\{[\s\S]*\})/);
  return JSON.parse(match ? match[1] || match[0] : text.trim());
};

exports.suggestTasks = async (req, res) => {
  const { goal } = req.body;
  if (!goal) return res.status(400).json({ success: false, message: 'Goal is required' });

  const text = await gemini(
    `You are a productivity expert. Generate 5 actionable tasks for this goal: "${goal}".
Return ONLY a valid JSON array (no markdown, no explanation) with fields: title (string), description (string), priority ("low"|"medium"|"high"|"critical"), dueDate (ISO string within next 30 days).`
  );

  const tasks = extractJSON(text);
  res.status(200).json({ success: true, tasks });
};

exports.breakdownTask = async (req, res) => {
  const { taskTitle, taskDescription } = req.body;
  if (!taskTitle) return res.status(400).json({ success: false, message: 'Task title is required' });

  const text = await gemini(
    `Break down this task into 3-7 specific subtasks.
Task: ${taskTitle}
Description: ${taskDescription || ''}
Return ONLY a valid JSON array (no markdown) with fields: title (string), completed (boolean, always false).`
  );

  const subtasks = extractJSON(text);
  res.status(200).json({ success: true, subtasks });
};

exports.prioritizeTask = async (req, res) => {
  const { taskTitle, taskDescription, dueDate } = req.body;

  const text = await gemini(
    `Analyze this task and suggest a priority level.
Title: ${taskTitle}
Description: ${taskDescription || ''}
Due: ${dueDate || 'not set'}
Return ONLY valid JSON (no markdown): { "priority": "low"|"medium"|"high"|"critical", "reason": "short explanation" }`
  );

  const result = extractJSON(text);
  res.status(200).json({ success: true, ...result });
};
