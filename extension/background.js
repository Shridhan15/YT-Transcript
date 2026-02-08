chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.tabs.sendMessage(
    tab.id,
    { type: "TOGGLE_SIDEBAR" },
    () => {
      // ✅ Ignore error if content script not present
      if (chrome.runtime.lastError) {
        console.log("Content script not ready:", chrome.runtime.lastError.message);
      }
    }
  );
});
