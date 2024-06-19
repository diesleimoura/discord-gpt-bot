const axios = require('axios');

// Configuração da chave da API do OpenAI
const apiKey = 'sk-proj-ZbfD6uWKIIrtKLFHHENnT3BlbkFJlFJXCSeFZjrVLX0xSEev';

async function testOpenAI() {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello, world!' }
        ],
        max_tokens: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );
    console.log(response.data.choices[0].message.content.trim());
  } catch (error) {
    console.error('Erro ao chamar a API do OpenAI:', error.response ? error.response.data : error.message);
  }
}

testOpenAI();
