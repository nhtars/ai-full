import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function (req, res) {
  try {
    const { text } = await req.json();
    if (!text) return res.status(400).json({ error: 'Missing text' });

    // Optional: If you have OpenAI TTS model available, implement here.
    // This is a placeholder returning 501 if not implemented.
    return res.status(501).json({ error: 'Server-side TTS not implemented. Use client-side Web Speech.' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
