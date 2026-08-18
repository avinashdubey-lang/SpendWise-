from app.ai.client import client

response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents="Say hello in one sentence.",
)

print(response.text)