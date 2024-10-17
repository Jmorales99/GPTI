const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

async function obtener_recomendaciones(aptitudes) {
  const prompt = `Dada la siguiente información del perfil de una persona, sugiere únicamente una lista de 5 filtros de búsqueda para trabajos relevantes sin texto adicional:\n${aptitudes}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente que genera una lista de filtros para búsqueda de trabajos. Estos 5 filtros deben ser lo más acotados y concisos posibles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 70,
      temperature: 0.5,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    return `Error al comunicarse con la API: ${error.message}`;
  }
}

module.exports = {
  obtener_recomendaciones,
};