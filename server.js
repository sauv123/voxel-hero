import express from 'express';
import cors from 'cors';
import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

function readKnowledge(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, 'src/knowledge', filePath), 'utf8');
  } catch (e) {
    return '';
  }
}

app.post('/api/chat', async (req, res) => {
  const { messages, persona } = req.body;

  const about = readKnowledge('about.md');
  const experience = readKnowledge('experience.md');
  const skills = readKnowledge('skills.md');
  const philosophy = readKnowledge('philosophy.md');
  const personality = readKnowledge('personality.md');
  const mica = readKnowledge('projects/mica.md');
  const orco = readKnowledge('projects/orco.md');
  const olo = readKnowledge('projects/olo.md');

  const systemPrompt = `
You are Sauveer's AI sidekick, a voxel deer traversing a digital forest.
${personality}

---
KNOWLEDGE BASE:
[ABOUT]
${about}
[EXPERIENCE]
${experience}
[SKILLS]
${skills}
[PHILOSOPHY]
${philosophy}
[PROJECT: MICA]
${mica}
[PROJECT: ORCO]
${orco}
[PROJECT: OLO]
${olo}
---
RULES:
1. Keep answers concise, engaging. No essays.
2. The user selected the "${persona}" persona. Adjust tone.
3. If you reference a project, ALWAYS include a CTA link exactly in this format at the end: [LINK:PROJECT_NAME] (e.g. [LINK:MICA]).
4. Do not make things up.
`;

  try {
    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
    });
    result.pipeDataStreamToResponse(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
