import pandas as pd
import pickle
import os
from sentence_transformers import SentenceTransformer
from sklearn.svm import LinearSVC

# ==============================
# 📁 FIX PATHS (VERY IMPORTANT)
# ==============================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

true_path = os.path.join(BASE_DIR, "../data/True.csv")
fake_path = os.path.join(BASE_DIR, "../data/Fake.csv")

# ==============================
# 📊 LOAD DATA
# ==============================
print("Loading datasets...")

true_df = pd.read_csv(true_path)
fake_df = pd.read_csv(fake_path)

# ==============================
# 🏷️ ADD LABELS
# ==============================
true_df["credibility"] = "real"
fake_df["credibility"] = "fake"

# ==============================
# 🧠 COMBINE TITLE + TEXT
# ==============================
true_df["text"] = true_df["title"] + " " + true_df["text"]
fake_df["text"] = fake_df["title"] + " " + fake_df["text"]

# Keep only required columns
true_df = true_df[["text", "credibility"]]
fake_df = fake_df[["text", "credibility"]]

# ==============================
# 🔄 MERGE + SHUFFLE
# ==============================
df = pd.concat([true_df, fake_df])
df = df.sample(frac=1).reset_index(drop=True)

# OPTIONAL: use small dataset for testing
# df = df.head(2000)

print("Dataset size:", len(df))

# ==============================
# 🧹 BASIC CLEANING
# ==============================
df["text"] = df["text"].str.lower()

# ==============================
# 🤖 LOAD EMBEDDING MODEL
# ==============================
print("Loading embedding model...")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# ==============================
# 🔄 TEXT → EMBEDDINGS
# ==============================
print("Encoding text... (this may take a few minutes)")

X = embedder.encode(
    df["text"].tolist(),
    show_progress_bar=True
)

print("Encoding done!")

# ==============================
# 🎯 LABELS
# ==============================
y = df["credibility"].tolist()

# ==============================
# 🤖 TRAIN MODEL
# ==============================
print("Training model...")

model = LinearSVC()
model.fit(X, y)

print("Training done!")

# ==============================
# 💾 SAVE MODEL
# ==============================
model_path = os.path.join(BASE_DIR, "credibility_model.pkl")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

print("✅ Model saved at:", model_path)