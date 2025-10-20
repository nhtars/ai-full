import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function (req, res) {
  try {
    const body = await req.json();
    const user = body.message || '';
    const level = body.level || 1;

    const system = `You are a Mandarin teacher. Use vocabulary mostly within HSK level ${level}. When replying:
- Reply in Chinese (characters). Provide Pinyin and a short Vietnamese translation in parentheses when asked.
- If user's sentence has mistakes, provide a corrected sentence and a brief Vietnamese explanation.
- Also return a short 'expected' sentence (one concise Chinese sentence) that the student should aim to say, for scoring.`

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.6,
      max_tokens: 400
    });

    const reply = completion.choices?.[0]?.message?.content || '';
    // We expect model to include an 'expected' sentence; if not, we attempt to derive fallback
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}
