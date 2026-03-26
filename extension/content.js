// ==========================
// TRUTHLENS CONTENT SCRIPT
// ==========================

console.log("🔥 TruthLens content script LOADED");

// ==========================
// SELECT TEXT → ANALYZE
// ==========================
document.addEventListener("mouseup", async () => {
  console.log("🟢 Mouse event triggered");

  const selectedText = window.getSelection().toString().trim();
  console.log("Selected:", selectedText);

  if (selectedText.length > 10) {
    try {
      console.log("📡 Calling API...");

      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: selectedText })
      });

      const data = await res.json();

      // 🔥 FULL DEBUG
      console.log("✅ FULL API RESPONSE:", data);
      console.log("🧠 SUMMARY VALUE:", data.summary);

      // ✅ Show popup
      showPopup(data.overall, data.summary);

      // ✅ Highlight sentences
      highlightSentences(data.sentences);

    } catch (err) {
      console.error("❌ API error:", err);
    }
  }
});


// ==========================
// POPUP RESULT (FINAL UI)
// ==========================
function showPopup(result, summary) {
  const old = document.getElementById("truthlens-popup");
  if (old) old.remove();

  const box = document.createElement("div");
  box.id = "truthlens-popup";

  let content = "";

  if (typeof summary === "object") {
    content = `
      <div><b>Reason:</b> ${summary.verdict_reason}</div>
      <div><b>Tone:</b> ${summary.tone}</div>
      <div><b>Red Flags:</b> ${summary.red_flags.join(", ")}</div>
    `;
  } else {
    content = summary || "No explanation";
  }

  box.innerHTML = `
    <div style="font-weight:bold;margin-bottom:6px;">
      ⚠️ ${result.label.toUpperCase()}
    </div>
    <div style="font-size:12px;margin-bottom:8px;">
      Confidence: ${result.confidence}
    </div>
    <div style="font-size:12px;line-height:1.4;">
      ${content}
    </div>
  `;

  box.style.position = "fixed";
  box.style.bottom = "20px";
  box.style.right = "20px";
  box.style.background = result.label === "fake" ? "#ff4d4d" : "#4CAF50";
  box.style.color = "white";
  box.style.padding = "14px";
  box.style.borderRadius = "12px";
  box.style.maxWidth = "300px";
  box.style.zIndex = "999999";

  document.body.appendChild(box);

  setTimeout(() => box.remove(), 6000);
}

// ==========================
// SAFE TEXT HIGHLIGHTING
// ==========================
function highlightSentences(sentences) {
  if (!sentences || !Array.isArray(sentences)) {
    console.log("⚠️ No sentences to highlight");
    return;
  }

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;

  while ((node = walker.nextNode())) {
    sentences.forEach(item => {
      if (
        item.label === "fake" &&
        item.confidence > 0.5 &&
        node.nodeValue.includes(item.sentence)
      ) {
        const span = document.createElement("span");
        span.style.backgroundColor = "rgba(255,0,0,0.3)";
        span.style.borderRadius = "3px";
        span.textContent = item.sentence;

        const parts = node.nodeValue.split(item.sentence);
        const fragment = document.createDocumentFragment();

        parts.forEach((part, i) => {
          fragment.appendChild(document.createTextNode(part));

          if (i < parts.length - 1) {
            fragment.appendChild(span.cloneNode(true));
          }
        });

        node.parentNode.replaceChild(fragment, node);
      }
    });
  }
}