import pickle
import os
import re
from sentence_transformers import SentenceTransformer

# ==============================
# 📁 LOAD PATHS
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "credibility_model.pkl")

# ==============================
# 🤖 LOAD MODEL + EMBEDDER
# ==============================
print("Loading model...")

embedder = SentenceTransformer('all-MiniLM-L6-v2')

with open(model_path, "rb") as f:
    model = pickle.load(f)

print("Model loaded!")

# ==============================
# 🔮 SINGLE TEXT PREDICTION
# ==============================
def predict(text):
    embedding = embedder.encode([text])

    prediction = model.predict(embedding)[0]
    confidence = float(abs(model.decision_function(embedding)[0]))

    return {
        "label": str(prediction),
        "confidence": round(confidence, 2)
    }

# ==============================
# 🧠 SENTENCE-LEVEL PREDICTION
# ==============================
def predict_sentences(text):
    # split into sentences
    sentences = re.split(r'[.!?]', text)

    results = []

    for s in sentences:
        s = s.strip()

        # skip very small fragments
        if len(s) < 10:
            continue

        embedding = embedder.encode([s])

        prediction = model.predict(embedding)[0]
        confidence = float(abs(model.decision_function(embedding)[0]))

        results.append({
            "sentence": s,
            "label": str(prediction),
            "confidence": round(confidence, 2)
        })

    return results

# ==============================
# 🧪 TEST BLOCK
# ==============================
if __name__ == "__main__":
    print("\n--- TESTING MODEL ---\n")

    text1 = "Breaking!!! Scientists reveal shocking secret cure!!!"
    text2 = "Government releases official economic report"

    print("Text 1:", text1)
    print("Result:", predict(text1))

    print("\nText 2:", text2)
    print("Result:", predict(text2))

    print("\nSentence Analysis:")
    print(predict_sentences(text1))