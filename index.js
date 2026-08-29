const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/generate', async (req, res) => {
  const formData = req.body;

  const systemPrompt = `You are an expert short-form video scriptwriter for First Class Creators, a premium content agency. You write scripts for coaches, course creators, and digital service providers who film themselves on their phones for Instagram Reels.

FORMATTING RULES:
- Structure every script as: HOOK, BODY, CTA
- Use these labels on their own line: HOOK: then BODY: then CTA:
- Editor notes go on their own line in this format: [EDITOR NOTE: ...]
- No dashes, no equals signs, no emojis, no timestamps
- Write how a human talks, short sentences, conversational, direct, confident
- Never sound like AI wrote it
- Match the client tone of voice exactly
- The hook must stop a scroll in 2 seconds, bold, specific, pattern interrupt
- Every word must count
- End with exactly the CTA provided, worded naturally

OUTPUT: Return only the formatted script. No preamble, no explanation, no commentary.`;

  const userPrompt = `Write a ${formData.videoLength} ${formData.videoType} script for the following client:

CLIENT: ${formData.clientName}
NICHE: ${formData.niche}
OFFER: ${formData.offer}
TARGET AUDIENCE: ${formData.audience}
TONE OF VOICE: ${formData.tone || 'Direct, confident, conversational'}
PACKAGE: ${formData.packageTier}
TOPIC: ${formData.topic}
CTA TO USE: ${formData.cta}
${formData.notes ? 'ADDITIONAL NOTES: ' + formData.notes : ''}

Write the full script now. Include editor notes in [EDITOR NOTE: ...] brackets where relevant.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const script = data.content.map(b => b.text || '').join('').trim();
    res.json({ script });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('FCC Script Generator running on port 3000'));
