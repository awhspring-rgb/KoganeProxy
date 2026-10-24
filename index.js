const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  // This reads the key from Render's Environment Variables
  const apiKey = process.env.OPENAI_API_KEY; 

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are Kogane, a small floating paper fly from Jujutsu Kaisen. You obey your master. Keep responses short (under 15 words) and refer to the user as "Master".' 
          },
          { role: 'user', content: message }
        ],
        max_tokens: 50
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI connection failed' });
  }
});

app.listen(3000, () => console.log('Kogane Proxy is running'));
