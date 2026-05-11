const groqService = require("../services/groqService");
const { sanitizeResumeText } = require("../utils/sanitize");

/**
 * Controller for AI-powered analysis and chat.
 */

// Analyze resume for a specific role and company
exports.analyze = async (req, res) => {
  const { resumeText, company, role } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: "Resume text is required." });
  }

  const sanitizedResume = sanitizeResumeText(resumeText);

  try {
    const prompt = `You are a world-class technical career advisor and recruiter. Analyze this resume specifically for the target listed below.

Provide an EXTREMELY GRANULAR AND DETAILED structured analysis with these EXACT sections:

## TARGET GOAL
State the target company (${company || "General"}) and the target role (${role || "Software Engineer"}).

## CANDIDATE PROFILE
Provide a concise professional summary of the candidate based STRICTLY ON THE RESUME ONLY. Do not assume any details not present in the text.

## SKILL GAPS
List 5 highly specific technical, architectural, or methodology gaps that separate the candidate from a "senior" level hire for this ${role} role at ${company}.

## 3-MONTH ROADMAP (GRANULAR & DETAILED)
Provide a week-by-week, day-by-day plan for ALL 3 MONTHS.
- **Month 1 (Deep Foundations)**: Provide a specific topic or task for EVERY SINGLE DAY of the month.
- **Month 2 (Implementation)**: Define a complex, production-grade project to build related to ${role}. Provide weekly milestones and a feature list.
- **Month 3 (Mastery & Career)**: Focus on specific advanced algorithms, system design patterns, and behavioral interview techniques for each week. Include specific resources or study topics.

## KEY STRENGTHS
List 3 unique competitive advantages found in the resume.

## QUICK WINS
List 3 high-impact actions to take within the next 48 hours to improve the candidate's professional presence.

Resume Text (Professional Context Only):
${sanitizedResume.substring(0, 8000)}`;

    const analysis = await groqService.analyzeResume(prompt);
    res.json({ analysis, company: company || "General" });
  } catch (error) {
    console.error("AI Analysis Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Chat with the AI assistant
exports.chat = async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required." });

  try {
    const systemPrompt = `You are SkillSync AI Assistant, an expert career advisor. Be concise. Use bullet points. Keep under 200 words.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: h.text
      })),
      { role: "user", content: message }
    ];

    const reply = await groqService.chatWithAI(messages);
    res.json({ reply });
  } catch (error) {
    console.error("AI Chat Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
