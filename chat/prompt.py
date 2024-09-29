import openai

# Configura tu clave de API de OpenAI
openai.api_key = 'tu-api-key-aqui'

# Función para obtener recomendaciones de filtros
def obtener_recomendaciones(aptitudes):
    # Crear el prompt basado en las aptitudes
    prompt = f"Dada la siguiente información del perfil de una persona, sugiere filtros de búsqueda para trabajos relevantes:\n{aptitudes}"

    try:
        # Realizar la solicitud a la API de OpenAI
        response = openai.Completion.create(
            engine="text-davinci-003",  # Puedes usar "gpt-3.5-turbo" o "gpt-4" si tienes acceso
            prompt=prompt,
            max_tokens=150,  # Ajusta según el tamaño de la respuesta que esperas
            n=1,  # Número de respuestas que deseas recibir
            stop=None,  # Puedes especificar un token de parada si es necesario
            temperature=0.7  # Controla la creatividad de la respuesta
        )
        
        # Procesar y devolver la respuesta
        return response.choices[0].text.strip()

    except Exception as e:
        return f"Error al comunicarse con la API: {str(e)}"

# Datos del perfil de la persona (aptitudes)
aptitudes = """
Nombre: Juan Pérez
Habilidades: Python, Data Analysis, Machine Learning, SQL, Git
Experiencia: 3 años en análisis de datos en empresas tecnológicas
Intereses: Tecnologías de la información, desarrollo de software, análisis de datos
"""

# Obtener recomendaciones
recomendaciones = obtener_recomendaciones(aptitudes)
print("Recomendaciones de filtros:", recomendaciones)
