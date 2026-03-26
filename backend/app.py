import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from flask import Flask, request, jsonify
from flask_cors import CORS
from model.predict import predict 
from gemini_utils import generate_summary


app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "TruthLens API running"

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        text = data.get("text", "")

        if not text:
            return jsonify({"error": "No text provided"}), 400

        # 🔹 ML Prediction
        result = predict(text)
        # expected: {"label": "FAKE", "confidence": 0.87, "sentences": [...]}

        # 🔹 Gemini Explanation (safe fallback)
        try:
            summary = generate_summary(text, result["label"])
        except Exception as e:
            print("Gemini error:", e)
            summary = {
                "verdict_reason": "Could not generate explanation",
                "tone": "unknown",
                "red_flags": []
            }

        return jsonify({
            "overall": {
                "label": result["label"],
                "confidence": result["confidence"]
            },
            "sentences": result.get("sentences", []),
            "summary": summary
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)