console.log("background.js running");

// CREATE VAR TO STORE DATA FROM CONTENT SCRIPT
// LISTEN FOR DATA FROM CONTENT SCRIPT
// IF RECIEVING DATA, STORE IN VAR
// LISTEN FOR REQUEST FROM POPUP.JS FOR DATA (FROM CONTENT.JS)
let items = null;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendData") {
    items = message.data;
    console.log("data recieved from content.js ", items);
  } else if (message.action === "getData") {
    console.log("data sent from background to popup.js:", items);
    sendResponse({
      data: items,
    });
  }
});