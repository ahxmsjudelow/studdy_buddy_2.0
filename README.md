# Study Buddy

Run: `npm install && npm run dev` (needs `GEMINI_API_KEY` in `.env` for AI features).
Build for production: `npm run build && npm start`. Tests: `npm test`.

- **Works without AI:** the AI Tutor falls back to a built-in syllabus tutor, flashcard generation falls back to the built-in bank, and Turbo builds notes/flashcards/quiz from pasted transcripts or class notes.
- **Teachers:** "Classes & Teachers" tab. Teachers register with their school/organization, create classes, and upload notes, links or files (PDF, Office, images, text, up to 8 MB). Students enter the 6-character class code to see the material. Data is stored in `DATA_DIR` (default `./data`).
