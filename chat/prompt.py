import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv('API_KEY')


def obtener_recomendaciones(aptitudes):

    prompt = f"Dada la siguiente información del perfil de una persona, sugiere únicamente una lista de 5 filtros de búsqueda para trabajos relevantes sin texto adicional:\n{aptitudes}"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Eres un asistente que genera una lista de filtros para búsqueda de trabajos. Estos 5 filtros deben ser lo más acotados y conscisos posibles."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=70, 
            temperature=0.5 
        )

        return response['choices'][0]['message']['content'].strip()

    except Exception as e:
        return f"Error al comunicarse con la API: {str(e)}"

aptitudes = """
Nombre: Juan Pérez
Habilidades: Python, Data Anlysis, Machine Learning, SQL, Git
Intereses: analisar datos para obtener resultados, trabajar en equipo, aprender nuevas tecnologías
"""

recomendaciones = obtener_recomendaciones(aptitudes)
print("Recomendaciones de filtros:", recomendaciones)
