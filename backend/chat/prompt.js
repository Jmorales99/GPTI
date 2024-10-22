const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

async function generarCartaPresentacion(datos) {
  const prompt = `Genera una carta de presentación utilizando la siguiente información del candidato. La carta debe tener un máximo de 15 líneas:\n\n` +
    `Nombre: ${datos.nombre}\n` +
    `Teléfono: ${datos.telefono}\n` +
    `Correo: ${datos.correo}\n` +
    `Habilidades: ${datos.habilidades.join(', ')}\n` +
    `Experiencia: ${datos.experiencia}\n` +
    `Intereses: ${datos.intereses}\n` +
    `Motivación: ${datos.porque}\n\n` +
    `Escribe una carta de presentación concisa y profesional.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente que genera cartas de presentación para postulaciones laborales. La carta debe ser concisa, profesional y no exceder las 15 líneas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.5,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    return `Error al comunicarse con la API: ${error.message}`;
  }
}

module.exports = {
  generarCartaPresentacion,
};
