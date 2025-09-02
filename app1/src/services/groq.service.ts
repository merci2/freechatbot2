// src/services/groq.service.ts
import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class GroqService {
  static async generate(prompt: string, context: string = ''): Promise<string> {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API Key nicht konfiguriert');
    }

    try {
      const messages = context ? [
        { role: "system", content: context },
        { role: "user", content: prompt }
      ] : [
        { role: "user", content: prompt }
      ];

      const response = await axios.post(
        GROQ_API_URL,
        {
          // model: "mixtral-8x7b-32768",
          model: "llama-3.3-70b-versatile",
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Groq API Error:', error.response?.data || error.message);

        if (error.response?.status === 429) {
          throw new Error('Rate Limit erreicht. Warte eine Minute.');
        }

        throw new Error(error.response?.data?.error?.message || 'Groq API Fehler');
      } else {
        console.error('Groq API Error:', error);
        throw new Error('Groq API Fehler');
      }
    }
  }
}