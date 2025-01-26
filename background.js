let currentTabId = null;
let startTime = null;
const tabTimes = {};

// Track when a tab is activated
chrome.tabs.onActivated.addListener(({ tabId }) => {
  const now = Date.now();



  // Save time spent on the previous tab if it exists
  if (currentTabId !== null && startTime !== null) {
    const elapsedTime = now - startTime;
    if (!tabTimes[currentTabId]) tabTimes[currentTabId] = 0;
    tabTimes[currentTabId] += elapsedTime;
    console.log(`Tab ${currentTabId} used for ${elapsedTime} ms`);//this is the part that show the time in the console
  }


    // Update current tab and start time
    currentTabId = tabId;
    startTime = now;

});

// Save tab usage data when the extension is unloaded or the browser is closed
chrome.runtime.onSuspend.addListener(() => {
  const now = Date.now();
  if (currentTabId !== null && startTime !== null) {
    const elapsedTime = now - startTime;
    if (!tabTimes[currentTabId]) tabTimes[currentTabId] = 0; //i don't understand the syntax here
    tabTimes[currentTabId] += elapsedTime;
  }

  chrome.storage.local.set({ tabTimes }, () => {
    console.log("Tab usage data saved:", tabTimes);
  });
});
