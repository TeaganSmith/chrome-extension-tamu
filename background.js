chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    // Here you would call the APIs to scan the tab.url
    scanWithDatadog(tab.url);
    scanWithGoogleSafeBrowsing(tab.url);
  }
});

function scanWithDatadog(url) {
  // API call to Datadog's sensitive data scanner
}

function scanWithGoogleSafeBrowsing(url) {
  // API call to Google's Safe Browsing API
}
