import axios from 'axios';

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;

export const callMistralAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur avec l\'API :', error);
    throw new Error('Impossible de contacter l\'API');
  }
};