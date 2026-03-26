chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: request.text })
    })
      .then(res => res.json())
      .then(data => sendResponse(data))
      .catch(err => {
        console.error("API error:", err);
        sendResponse({ error: "API failed" });
      });

    return true; // keeps message channel open (VERY IMPORTANT)
  }
});