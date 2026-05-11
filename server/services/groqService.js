const axios = require("axios");

/**
 * Service for interacting with the Groq AI API.
 */

const analyzeResume = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional career coach and technical recruiter."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4096
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    throw new Error(`Groq Analysis Error: ${errMsg}`);
  }
};

const chatWithAI = async (messages) => {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.8,
        max_tokens: 1024
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    const errMsg = error.response?.data?.error?.message || error.message;
    throw new Error(`Groq Chat Error: ${errMsg}`);
  }
};

module.exports = {
  analyzeResume,
  chatWithAI
};
