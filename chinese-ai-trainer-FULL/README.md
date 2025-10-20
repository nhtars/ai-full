# chinese-ai-trainer-FULL

## Quick start (Vercel)
1. Upload repo to GitHub or import ZIP directly into Vercel.
2. In Vercel Project Settings -> Environment Variables:
   - OPENAI_API_KEY = <your_openai_key>
3. Build command: `npm run build`
   Output Directory: `dist`
4. Deploy.

## Features
- UI style B (assistant)
- Recorder -> /api/transcribe (Whisper)
- /api/chat -> GPT-4o (corrective feedback)
- Client-side TTS (Web Speech API)
- Minimal pronunciation scoring (Levenshtein %, shown when expanding a user message)
- HSK1-6 dataset loaded client-side at runtime from provided GitHub URLs
