import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const config = { api: { bodyParser: false } };

export default async function (req, res) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    // Use OpenAI SDK transcription
    const transcript = await client.audio.transcriptions.create({
      file,
      model: 'whisper-1'
    });
    const text = transcript?.text || transcript;
    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}
