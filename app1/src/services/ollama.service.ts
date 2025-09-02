import axios from 'axios';

const OLLAMA_API_URL = 'http://localhost:11434/api';

export class OllamaService {
  static async checkHealth(): Promise<boolean> {
    try {
      await axios.get(`${OLLAMA_API_URL}/tags`);
      return true;
    } catch {
      return false;
    }
  }

  static async generate(prompt: string, context: string = ''): Promise<string> {
    try {
      const fullPrompt = context 
        ? `Context: ${context}\n\nQuestion: ${prompt}\n\nAnswer:` 
        : prompt;

      const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
        // model: 'mistral:7b-instruct',
        model: "llama-3.3-70b-versatile",
        prompt: fullPrompt,
        stream: false,
      });

      return response.data.response;
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw new Error('Failed to generate response');
    }
  }
}