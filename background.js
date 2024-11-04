console.log("background.js running");
// CREATE VAR TO STORE DATA FROM CONTENT SCRIPT
// LISTEN FOR DATA FROM CONTENT SCRIPT
// IF RECIEVING DATA, STORE IN VAR
// LISTEN FOR REQUEST FROM POPUP.JS FOR DATA (FROM CONTENT.JS)
let items = [];
let originalItems = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendData") {
    items = message.data;
    originalItems = JSON.parse(JSON.stringify(message.data)); // Make a deep copy of original data
    console.log("data received in background.js:", items);
    return true;
  } else if (message.action === "getData") {
    sendResponse({
      data: items,
    });
    return true;
  } else if (message.action === "resetData") {
    items = JSON.parse(JSON.stringify(originalItems)); // Reset to original data
    sendResponse({
      data: items,
    });
    return true;
  }
  return true;
});
