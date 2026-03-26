// ========================
// TRUTHLENS — script.js
// ========================

const API_URL = "http://127.0.0.1:5000/analyze";

// Elements
const textInput    = document.getElementById("textInput");
const analyzeBtn   = document.getElementById("analyzeBtn");
const analyzeBtnTxt= document.getElementById("analyzeBtnText");
const spinner      = document.getElementById("spinner");
const clearBtn     = document.getElementById("clearBtn");
const charCount    = document.getElementById("charCount");

const outputPlaceholder = document.getElementById("outputPlaceholder");
const outputResults     = document.getElementById("outputResults");

const verdictBadge  = document.getElementById("verdictBadge");
const verdictConf   = document.getElementById("verdictConf");
const confBarFill   = document.getElementById("confBarFill");
const confPct       = document.getElementById("confPct");
const verdictCard   = document.getElementById("verdictCard");

const summaryCard   = document.getElementById("summaryCard");
const summaryText   = document.getElementById("summaryText");

const sentencesCard = document.getElementById("sentencesCard");
const sentencesList = document.getElementById("sentencesList");

// ========================
// CHAR COUNT
// ========================
textInput.addEventListener("input", () => {
  const len = textInput.value.length;
  charCount.textContent = `${len} character${len !== 1 ? "s" : ""}`;
});

// ========================
// CLEAR
// ========================
clearBtn.addEventListener("click", () => {
  textInput.value = "";
  charCount.textContent = "0 characters";
  hideResults();
});

// ========================
// ANALYZE ON CLICK
// ========================
analyzeBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();

  if (!text || text.length < 20) {
    showToast("Please enter at least 20 characters.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    renderResults(data);

  } catch (err) {
    console.error(err);

    // If backend is offline, render mock results for demo purposes
    if (err.message.includes("fetch") || err.message.includes("Failed")) {
      showToast("Backend offline — showing demo results.");
      renderResults(getMockResult(text));
    } else {
      showToast("Error: " + err.message);
    }
  } finally {
    setLoading(false);
  }
});

// ========================
// ALSO ALLOW ENTER (ctrl+enter)
// ========================
textInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    analyzeBtn.click();
  }
});

// ========================
// RENDER RESULTS
// ========================
function renderResults(data) {
  const { overall, sentences, summary } = data;

  // Show overall verdict
  const isFake   = overall.label === "fake";
  const rawConf  = overall.confidence;

  // Normalize confidence to 0–100 (decision_function can be >1)
  const pct      = Math.min(Math.round(rawConf * 100), 100);
  const label    = isFake ? "FAKE" : "REAL";
  const cls      = isFake ? "is-fake" : "is-real";

  verdictBadge.textContent = label;
  verdictBadge.className   = `verdict-badge ${cls}`;
  verdictConf.textContent  = `${pct}% confidence`;

  confBarFill.className    = `conf-bar-fill ${cls}`;
  confPct.textContent      = `${pct}%`;

  // Animate bar
  requestAnimationFrame(() => {
    setTimeout(() => {
      confBarFill.style.width = pct + "%";
    }, 50);
  });

  // Summary (Gemini / optional)
  if (summary && summary.trim()) {
    summaryText.textContent  = summary;
    summaryCard.style.display = "block";
  } else {
    summaryCard.style.display = "none";
  }

  // Sentences
  if (sentences && sentences.length > 0) {
    sentencesList.innerHTML = "";

    sentences.forEach((item, i) => {
      const isFakeSent  = item.label === "fake";
      const sentPct     = Math.min(Math.round(item.confidence * 100), 100);
      const sentCls     = isFakeSent ? "is-fake" : "is-real";
      const sentLabel   = isFakeSent ? "Fake" : "Real";

      const el = document.createElement("div");
      el.className = `sentence-item ${sentCls}`;
      el.style.animationDelay = `${i * 0.06}s`;
      el.innerHTML = `
        <span class="sentence-badge">${sentLabel}</span>
        <div class="sentence-text">
          ${escapeHtml(item.sentence)}
          <div class="sentence-conf">${sentPct}% confidence</div>
        </div>
      `;
      sentencesList.appendChild(el);
    });

    sentencesCard.style.display = "block";
  } else {
    sentencesCard.style.display = "none";
  }

  // Show output
  outputPlaceholder.style.display = "none";
  outputResults.style.display     = "flex";

  // Scroll into view
  outputResults.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ========================
// HIDE RESULTS
// ========================
function hideResults() {
  outputPlaceholder.style.display = "block";
  outputResults.style.display     = "none";
  confBarFill.style.width         = "0%";
}

// ========================
// LOADING STATE
// ========================
function setLoading(active) {
  analyzeBtn.disabled      = active;
  analyzeBtnTxt.style.display = active ? "none" : "inline";
  spinner.classList.toggle("active", active);
}

// ========================
// TOAST
// ========================
function showToast(msg) {
  const toast       = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

// ========================
// ESCAPE HTML
// ========================
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ========================
// MOCK RESULT (when backend offline)
// ========================
function getMockResult(text) {
  const isFake = /shocking|secret|!!!|government|cure|hoax|conspiracy|fake/i.test(text);

  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .map((s, i) => {
      const f = /shocking|secret|!!!|government|cure|hoax|conspiracy|fake/i.test(s) || (isFake && i % 2 === 0);
      return {
        sentence:   s,
        label:      f ? "fake" : "real",
        confidence: parseFloat((0.5 + Math.random() * 0.45).toFixed(2))
      };
    });

  return {
    overall: {
      label:      isFake ? "fake" : "real",
      confidence: isFake ? 0.87 : 0.78
    },
    sentences,
    summary: isFake
      ? "This content exhibits several hallmarks of misinformation: sensational language, unverifiable claims, and emotional manipulation tactics designed to bypass critical thinking."
      : "This content appears to be credible. The language is measured, the claims are traceable to verifiable sources, and no obvious manipulation patterns were detected."
  };
}

// ========================
// SCROLL ANIMATIONS
// ========================
const observerOpts = { threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, observerOpts);

document.querySelectorAll(".step, .result-card").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  observer.observe(el);
});

// Add visible class handler
const visStyle = document.createElement("style");
visStyle.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(visStyle);

// ========================
// DOWNLOAD BUTTON
// ========================
document.getElementById("downloadBtn").addEventListener("click", (e) => {
  e.preventDefault();
  showToast("To install: load the extension folder via chrome://extensions → Developer Mode → Load Unpacked.");
});
