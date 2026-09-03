import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import fs from 'fs';
import path from 'path';

// Helper to safely read a file or return empty string
function readKnowledge(filePath) {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'src/knowledge', filePath), 'utf8');
  } catch (e) {
    return '';
  }
}

export const maxDuration = 30; // Vercel edge max duration

export default async function req(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, persona } = req.body;

  // Load all knowledge
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
1. Keep your answers concise, engaging, and highly scannable. Do not write essays.
2. The user has selected the "${persona}" persona. Adjust your tone accordingly:
   - Recruiter: Professional, highlight skills, ROI, and process.
   - Designer: Talk about typography, UX decisions, AI philosophy, and systems.
   - Curious: Be witty, a bit weird, talk about being a voxel deer.
3. If you reference a project, ALWAYS include a CTA link exactly in this format at the end of the message: [LINK:PROJECT_NAME] (e.g. [LINK:MICA] or [LINK:OLO] or [LINK:ORCO]). The frontend will parse this into a beautiful button.
4. Do not make things up. If it's not in the knowledge base, playfully admit you don't know but suggest looking at his work.
`;

  try {
    const result = streamText({
      model: google('gemini-1.5-flash'), // Or 'gemini-1.5-pro'
      system: systemPrompt,
      messages,
    });

    result.pipeDataStreamToResponse(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
