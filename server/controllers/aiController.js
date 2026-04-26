const https = require('https');

const gemini = (prompt) => new Promise((resolve, reject) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return reject(new Error('GEMINI_API_KEY not set'));

  const body = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.error) return reject(new Error(`Gemini API error: ${json.error.message}`));
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          console.error('Gemini raw response:', JSON.stringify(json));
          return reject(new Error('Empty response from Gemini'));
        }
        resolve(text);
      } catch (e) { reject(e); }
    });
  });
  req.on('error', reject);
  req.write(body);
  req.end();
});

const extractJSON = (text) => {
  // Try code block first
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return JSON.parse(codeBlock[1].trim());
  // Try raw JSON array
  const arrMatch = text.match(/(\[\s*\{[\s\S]*?\}\s*\])/);
  if (arrMatch) return JSON.parse(arrMatch[1]);
  // Try raw JSON object
  const objMatch = text.match(/(\{[\s\S]*?\})/);
  if (objMatch) return JSON.parse(objMatch[1]);
  return JSON.parse(text.trim());
};

exports.suggestTasks = async (req, res) => {
  const { goal } = req.body;
  if (!goal) return res.status(400).json({ success: false, message: 'Goal is required' });

  const text = await gemini(
    `You are a productivity expert. Generate exactly 5 actionable tasks for this goal: "${goal}".
Respond with ONLY a JSON array, no explanation, no markdown fences. Example format:
[{"title":"Task name","description":"What to do","priority":"medium","dueDate":"2026-05-10T00:00:00.000Z"}]
Priority must be one of: low, medium, high, critical. DueDate must be within next 30 days.`
  );

  const tasks = extractJSON(text);
  res.status(200).json({ success: true, tasks });
};

exports.breakdownTask = async (req, res) => {
  const { taskTitle, taskDescription } = req.body;
  if (!taskTitle) return res.status(400).json({ success: false, message: 'Task title is required' });

  const text = await gemini(
    `Break down this task into 3-7 specific subtasks.
Task: ${taskTitle}\nDescription: ${taskDescription || 'none'}
Respond with ONLY a JSON array, no explanation, no markdown fences. Example:
[{"title":"Subtask name","completed":false}]`
  );

  const subtasks = extractJSON(text);
  res.status(200).json({ success: true, subtasks });
};

exports.prioritizeTask = async (req, res) => {
  const { taskTitle, taskDescription, dueDate } = req.body;
  if (!taskTitle) return res.status(400).json({ success: false, message: 'Task title is required' });

  const text = await gemini(
    `Analyze this task and suggest a priority level.
Title: ${taskTitle}\nDescription: ${taskDescription || 'none'}\nDue: ${dueDate || 'not set'}
Respond with ONLY a JSON object, no explanation, no markdown fences. Example:
{"priority":"high","reason":"Short reason here"}
Priority must be one of: low, medium, high, critical.`
  );

  const result = extractJSON(text);
  res.status(200).json({ success: true, ...result });
};
