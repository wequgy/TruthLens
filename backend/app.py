import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from flask import Flask, request, jsonify
from flask_cors import CORS
from model.predict import predict, predict_sentences

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "TruthLens API Running"

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get("text", "")

    result = predict(text)
    sentences = predict_sentences(text)

    return jsonify({
        "overall": result,
        "sentences": sentences
    })

if __name__ == "__main__":
    app.run(debug=True)