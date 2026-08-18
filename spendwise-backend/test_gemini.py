import os
from google import genai

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

try:
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="Reply with only Hello"
    )

    print(response.text)

except Exception as e:
    print(type(e).__name__)
    print(e)