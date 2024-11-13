const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

async function generarCartaPresentacion(datos) {
  const prompt = `Genera una carta de presentación utilizando la siguiente información del candidato. La carta debe seguir el metodo de PCP:\n\n` +
    `Nombre: ${datos.nombre}\n` +
    `Teléfono: ${datos.telefono}\n` +
    `Correo: ${datos.correo}\n` +
    `Habilidades: ${datos.habilidades.join(', ')}\n` +
    `Experiencia: ${datos.experiencia}\n` +
    `Intereses: ${datos.intereses}\n` +
    `Motivación: ${datos.porque}\n\n` +
    `Datos de la oferta:\n` +
    `Título del puesto: Búsqueda de relatores en Concepción\n` +
    `Empresa: PERFECCIONATEC\n` +
    `Ciudad: Concepción\n` +
    `Enlace: https://www.chiletrabajos.cl/trabajo/busqueda-de-relatores-en-concepcion-3481776\n` +
    `Categoría: Educación y Psicopedagogía\n` +
    `Descripción: OTEC de Concepción, busca incorporar a su equipo a profesionales relatores con experiencia en cursos de capacitación, registrados en la plataforma REUF. El perfil ideal debe contar con un año de experiencia en docencia, capacitación o trabajo con OTEC, y especialización en las áreas de Ciencias Sociales o Salud.\n` +
    `Responsabilidades:\n` +
    `- Impartir cursos de capacitación en áreas como Psicología, Trabajo Social, Kinesiología, Fonoaudiología, Enfermería, entre otras.\n` +
    `- Asegurar la calidad de las actividades de formación y capacitación, garantizando el cumplimiento de los objetivos pedagógicos.\n` +
    `- Colaborar en la planificación y adaptación de los contenidos formativos según las normativas de SENCE.\n` +
    `- Generar informes y reportes de las actividades realizadas, evaluando los resultados y proponiendo mejoras.\n` +
    `Requisitos:\n` +
    `- Título en Psicología, Trabajo Social, Kinesiología, Fonoaudiología, Enfermería, u otras profesiones afines.\n` +
    `- Registro en la plataforma REUF.\n` +
    `- Experiencia mínima de un año en docencia, relatorías o capacitaciones.\n` +
    `- Conocimiento de normativas y procedimientos de SENCE.\n` +
    `- Competencias en comunicación, trabajo en equipo y adaptabilidad a metodologías de enseñanza.\n` +
    `Sueldo: $20 - $30 por hora. Horas previstas: 10 por semana.\n\n` +
    `Escribe una carta de presentación concisa y profesional que destaque las cualidades del candidato en relación con esta oferta de trabajo.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente que genera cartas de presentación para postulaciones laborales. La carta debe ser concisa, profesional y no exceder las 15 líneas siguiendo el metodo de PCP con los salto de lineas correspondientes.'
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
