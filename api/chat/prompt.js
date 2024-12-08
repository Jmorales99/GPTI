const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

async function generarCartaPresentacion(datos) {
  console.log(datos);
  const prompt = `Genera una carta de presentación utilizando la siguiente información del candidato y enfocado en la oferta de trabajo. La carta debe seguir el metodo de PCP:\n\n` +
    `Nombre: ${datos.nombre}\n` +
    `Teléfono: ${datos.telefono}\n` +
    `Correo: ${datos.correo}\n` +
    `Habilidades: ${datos.habilidades.join(', ')}\n` +
    `Experiencia: ${datos.experiencia}\n` +
    `Intereses: ${datos.intereses}\n` +
    `Motivación: ${datos.porque}\n\n` +
    `Oferta de trabajo: ${datos.oferta}\n`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente que genera cartas de presentación para postulaciones laborales. La carta debe ser concisa, profesional y no exceder las 15 líneas siguiendo el metodo de PCP con los salto de lineas correspondientes. Utiliza los datos entregados para personalizar la carta y enfocarla en la oferta de trabajo.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 300,
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