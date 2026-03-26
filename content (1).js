// ==========================
// TRUTHLENS CONTENT SCRIPT
// ==========================

console.log("🔥 TruthLens content script LOADED");

// Inject TruthLens styles
const style = document.createElement("style");
style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');

.truthlens-popup {
  position: fixed;
  top: 24px;
  right: 24px;
  width: 300px;
  background: #0a0a0f;
  color: #e8e8f0;
  padding: 0;
  border-radius: 14px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.07),
    0 24px 60px rgba(0,0,0,0.6),
    0 8px 20px rgba(0,0,0,0.4);
  font-family: 'DM Mono', 'Courier New', monospace;
  z-index: 999999;
  animation: tlSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  overflow: hidden;
}

.truthlens-popup::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
}

.truthlens-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.truthlens-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.truthlens-logo-icon {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.4);
}

.truthlens-logo-text {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
  color: #ffffff;
}

.truthlens-close {
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: rgba(255,255,255,0.35);
  transition: background 0.15s, color 0.15s;
  line-height: 1;
}

.truthlens-close:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.7);
}

.truthlens-verdict {
  padding: 16px 16px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.truthlens-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px 5px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.truthlens-badge::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.real {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.real::before {
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.fake {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.fake::before {
  background: #ef4444;
  box-shadow: 0 0 6px #ef4444;
}

.truthlens-body {
  padding: 14px 16px;
  font-size: 12px;
  line-height: 1.65;
  color: rgba(232, 232, 240, 0.72);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.truthlens-footer {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.truthlens-footer-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.25);
}

.truthlens-confidence-bar {
  flex: 1;
  height: 3px;
  background: rgba(255,255,255,0.08);
  border-radius: 99px;
  overflow: hidden;
  max-width: 80px;
}

.truthlens-confidence-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #7c3aed, #4f46e5);
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.truthlens-confidence-value {
  font-size: 11px;
  color: rgba(255,255,255,0.45);
  min-width: 36px;
  text-align: right;
}

@keyframes tlSlideIn {
  from {
    transform: translateX(24px) scale(0.97);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes tlShimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes tlSpin {
  to { transform: rotate(360deg); }
}

@keyframes tlPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.truthlens-loading-body {
  padding: 16px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.truthlens-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.08);
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: tlSpin 0.7s linear infinite;
  margin-bottom: 2px;
}

.truthlens-loading-label {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  animation: tlPulse 1.5s ease-in-out infinite;
}

.truthlens-skeleton {
  height: 10px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 25%,
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0.05) 75%
  );
  background-size: 200% 100%;
  animation: tlShimmer 1.4s ease-in-out infinite;
}

.truthlens-verdict-loading {
  padding: 16px 16px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.truthlens-badge-skeleton {
  width: 72px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 25%,
    rgba(255,255,255,0.09) 50%,
    rgba(255,255,255,0.05) 75%
  );
  background-size: 200% 100%;
  animation: tlShimmer 1.4s ease-in-out infinite;
}

.truthlens-content-fade-in {
  animation: tlFadeIn 0.35s ease forwards;
}

@keyframes tlFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

document.head.appendChild(style);

// ==========================
// SELECT TEXT → ANALYZE
// ==========================
document.addEventListener("mouseup", async (e) => {
  console.log("🟢 Mouse event triggered");

  const selectedText = window.getSelection().toString().trim();
  console.log("Selected:", selectedText);

  if (selectedText.length > 10) {  // ✅ FIXED
    // Show loading popup immediately, positioned near the selection
    const popup = showLoadingPopup(e);

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

      console.log("✅ FULL API RESPONSE:", data);

      // ✅ FIXED: correct call — replace loading with result
      populatePopup(popup, data);

      highlightSentences(data.sentences);

    } catch (err) {
      console.error("❌ API error:", err);
      popup.remove();
    }
  }
});

// ==========================
// SHARED POPUP SHELL
// ==========================
function createPopupShell(e) {
  // Remove any existing popup
  document.querySelectorAll(".truthlens-popup").forEach(el => el.remove());

  const popup = document.createElement("div");
  popup.className = "truthlens-popup";

  // Try to position near the selection, fall back to top-right
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    const popupWidth = 300;
    const margin = 12;

    let left = rect.right + margin;
    let top = rect.top + window.scrollY;

    // Flip left if too close to right edge
    if (left + popupWidth > window.innerWidth - margin) {
      left = rect.left - popupWidth - margin;
    }

    // Clamp to viewport
    left = Math.max(margin, Math.min(left, window.innerWidth - popupWidth - margin));
    top = Math.max(margin + window.scrollY, top);

    popup.style.position = "absolute";
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.right = "auto";
  }
  // (else: CSS default — fixed top-right via .truthlens-popup styles)

  popup.innerHTML = `
    <div class="truthlens-header">
      <div class="truthlens-logo">
        <div class="truthlens-logo-icon">🔍</div>
        <span class="truthlens-logo-text">TruthLens</span>
      </div>
      <span class="truthlens-close">✕</span>
    </div>
    <div class="truthlens-popup-content"></div>
  `;

  document.body.appendChild(popup);
  popup.querySelector(".truthlens-close").onclick = () => popup.remove();

  return popup;
}

// ==========================
// LOADING STATE
// ==========================
function showLoadingPopup(e) {
  const popup = createPopupShell(e);
  const content = popup.querySelector(".truthlens-popup-content");

  content.innerHTML = `
    <div class="truthlens-verdict-loading">
      <div class="truthlens-badge-skeleton"></div>
    </div>
    <div class="truthlens-loading-body">
      <div class="truthlens-spinner"></div>
      <span class="truthlens-loading-label">Analyzing...</span>
      <div class="truthlens-skeleton" style="width: 100%;"></div>
      <div class="truthlens-skeleton" style="width: 80%;"></div>
      <div class="truthlens-skeleton" style="width: 60%;"></div>
    </div>
  `;

  return popup;
}

// ==========================
// POPULATE WITH RESULT
// ==========================
function populatePopup(popup, data) {
  const isReal = data.overall.label === "REAL";
  const confidenceRaw = data.overall.confidence;
  const confidencePct = typeof confidenceRaw === "number"
    ? Math.round(confidenceRaw * 100)
    : parseInt(confidenceRaw) || 0;

  const content = popup.querySelector(".truthlens-popup-content");

  content.innerHTML = `
    <div class="truthlens-verdict truthlens-content-fade-in">
      <div class="truthlens-badge ${isReal ? "real" : "fake"}">
        ${data.overall.label}
      </div>
    </div>

    <div class="truthlens-body truthlens-content-fade-in" style="animation-delay: 0.05s;">
      ${data.summary?.verdict_reason || "No explanation available"}
    </div>

    <div class="truthlens-footer truthlens-content-fade-in" style="animation-delay: 0.1s;">
      <span class="truthlens-footer-label">Confidence</span>
      <div class="truthlens-confidence-bar">
        <div class="truthlens-confidence-fill" style="width: ${confidencePct}%"></div>
      </div>
      <span class="truthlens-confidence-value">${confidencePct}%</span>
    </div>
  `;

  setTimeout(() => popup.remove(), 8000);
}

// ==========================
// POPUP RESULT (FINAL UI)
// ==========================
function showPopup(data) {
  const popup = createPopupShell(null);
  populatePopup(popup, data);
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

        if (node.parentNode) { // ✅ SAFE FIX
          node.parentNode.replaceChild(fragment, node);
        }
      }
    });
  }
}