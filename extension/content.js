// ==========================
// SELECT TEXT → ANALYZE
// ==========================
console.log("🔥 TruthLens content script LOADED");
document.addEventListener("mouseup", () => {
  console.log("🟢 Mouse event triggered");
}); 
document.addEventListener("mouseup", async () => {
  const selectedText = window.getSelection().toString();

  if (selectedText.length > 20) {
    try {
      const res = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: selectedText })
      });

      const data = await res.json();

      showPopup(data.overall);
      highlightSentences(data.sentences);

    } catch (err) {
      console.error("API error:", err);
    }
  }
});

// ==========================
// POPUP RESULT
// ==========================
function showPopup(result) {
  const box = document.createElement("div");

  box.innerText = `⚠️ ${result.label.toUpperCase()} (${result.confidence})`;

  box.style.position = "fixed";
  box.style.bottom = "20px";
  box.style.right = "20px";
  box.style.background = result.label === "fake" ? "red" : "green";
  box.style.color = "white";
  box.style.padding = "10px";
  box.style.borderRadius = "8px";
  box.style.zIndex = "9999";

  document.body.appendChild(box);

  setTimeout(() => box.remove(), 3000);
}

// ==========================
// SAFE TEXT HIGHLIGHTING
// ==========================
function highlightSentences(sentences) {
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
        item.confidence > 1 &&
        node.nodeValue.includes(item.sentence)
      ) {
        const span = document.createElement("span");
        span.style.backgroundColor = "rgba(255,0,0,0.3)";
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