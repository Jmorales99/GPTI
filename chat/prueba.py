from openai import OpenAI
from dotenv import load_dotenv 
import os

load_dotenv()


client = OpenAI(
  api_key = os.getenv('API_KEY'),
  organization = os.getenv('ORGANIZATION')
  # project='$PROJECT_ID',
)

stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Say this is a test"}],
    stream=True,
)
for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")