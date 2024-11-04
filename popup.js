// WHEN POPUP.HTML OPENS, RUN CONTENT.JS; INJECT WITH SCRIPTING API EXECUTESCRIPT
document.addEventListener("DOMContentLoaded", async () => {
  const mainWrapper = document.querySelector("#grocery-items-wrapper");

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    // INJECT CONTENT.JS
    await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"],
    });

    // REQUEST COLOR CODES (FROM BACKGROUND)
    const response = await chrome.runtime.sendMessage({
      action: "getData",
    });
    console.log("data recieved from background ", response.data);
    // WHEN DATA RECEIVED
    response.data.forEach((itemObj) => {
      const { item, price, name } = itemObj;
      const itemRow = document.createElement("div");
      itemRow.setAttribute("class", "item-row");

      const itemWrapper = document.createElement("div");
      itemWrapper.setAttribute("class", "item-wrapper");
      itemWrapper.innerText = item;

      const priceWrapper = document.createElement("div");
      priceWrapper.setAttribute("class", "price-wrapper");
      priceWrapper.innerText = price;

      const nameWrapper = document.createElement("div");
      nameWrapper.setAttribute("class", "name-wrapper");

      const abRadio = document.createElement("input");
      abRadio.type = "radio";
      abRadio.name = item;
      abRadio.value = "alicia";
      abRadio.checked = true;
      const ibRadio = document.createElement("input");
      ibRadio.type = "radio";
      ibRadio.name = item;
      ibRadio.value = "ian";
      ibRadio.checked = false;
      const sharedRadio = document.createElement("input");
      sharedRadio.type = "radio";
      sharedRadio.name = item;
      sharedRadio.value = "shared";
      sharedRadio.checked = false;

      nameWrapper.append(abRadio, ibRadio, sharedRadio);

      itemRow.append(itemWrapper, priceWrapper, nameWrapper);
      mainWrapper.append(itemRow);
    });
  } catch (error) {
    console.log("Error ", error);
  }
});

/*function outerFunction() {
  let outerVariable = "I'm outside!";

  function innerFunction() {
    console.log(outerVariable); // Inner function has access to `outerVariable`
  }

  return innerFunction;
}

const closureFunc = outerFunction();
closureFunc(); // Logs: "I'm outside!" */
