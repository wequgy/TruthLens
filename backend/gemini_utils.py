from google import genai
import json
import re
import os
from dotenv import load_dotenv

# 🔑 API KEY
load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_summary(text, prediction):
    prompt = f"""
You are an AI fact-checking assistant.

Analyze the following text and explain briefly (max 1 sentences,  lines) why it is {prediction}.
Keep it concise.

Return ONLY valid JSON in this format:
{{
  "verdict_reason": "...",
  "tone": "...",
  "red_flags": ["...", "..."]
}}

Text:
{text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    output = response.text.strip()

    # 🔥 ONLY CHANGE: clean JSON extraction
    try:
        # direct parse first
        return json.loads(output)
    except:
        # extract JSON if wrapped in text / ```json
        match = re.search(r'\{.*\}', output, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except:
                pass

        # fallback (unchanged behavior)
        return {
            "verdict_reason": output,
            "tone": "unknown",
            "red_flags": []
        }