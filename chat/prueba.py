from openai import OpenAI

client = OpenAI(
  api_key='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',
  organization='org-6YfZIVXerkyghcLgH1KtbUb4',
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