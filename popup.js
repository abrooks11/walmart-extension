// WHEN POPUP.HTML OPENS, RUN CONTENT.JS; INJECT WITH SCRIPTING API EXECUTESCRIPT
document.addEventListener("DOMContentLoaded", async () => {
  const mainWrapper = document.querySelector("#grocery-items-wrapper");

  try {
    let groceryData;

    // CHECK IF DATA IS ALREADY STORED
    const storedData = await chrome.storage.local.get("groceryData");
    console.log(storedData);
    // IF DATA IS STORED; RENDER STORED DATA, ELSE FETCH DATA
    if (groceryData) {
      console.log("Using stored data", storedData.groceryData);
      groceryData = storedData.groceryData;
    } else {
      console.log("Fetching new data");

      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      // INJECT CONTENT.JS
      await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      });

      // REQUEST DATA (FROM BACKGROUND)
      const response = await chrome.runtime.sendMessage({
        action: "getData",
      });
      console.log("data recieved from background ", response.data);
      // Store the fetched data for later use
      await chrome.storage.local.set({ groceryData: response.data });
      groceryData = response.data;
    }
    // Only render if we have valid data
    if (groceryData) {
      renderData(groceryData);
    }

    // Add reset button creation and functionality
    const resetButton = document.createElement("button");
    resetButton.innerText = "Reset Data";
    resetButton.addEventListener("click", async () => {
      try {
        // Clear local storage
        await chrome.storage.local.remove("groceryData");
        // Clear the UI
        mainWrapper.innerHTML = "";

        // Request fresh data from background.js
        const response = await chrome.runtime.sendMessage({
          action: "getData",
        });
        console.log("Reset response:", response.data);

        // If we got fresh data back, render it
        if (response && response.data && Array.isArray(response.data)) {
          // Store the fresh data
          await chrome.storage.local.set({ groceryData: response.data });
          renderData(response.data);
        } else {
          console.error("Invalid reset response:", response);
        }
      } catch (error) {
        console.error("Reset error:", error);
      }
    });

    const totalsWrapper = document.querySelector("#totals-wrapper");
    totalsWrapper.prepend(resetButton);
  } catch (error) {
    console.log("Error ", error);
  }

  // Render function to populate the UI
  function renderData(data) {
    calculateTotals(data);
    data.forEach((itemObj) => {
      const { item, price, name } = itemObj;
      const itemRow = document.createElement("div");
      itemRow.setAttribute("class", "item-row");

      const itemWrapper = document.createElement("div");
      itemWrapper.setAttribute("class", "item-wrapper");
      itemWrapper.innerText = item;

      const priceWrapper = document.createElement("div");
      priceWrapper.setAttribute("class", "price-wrapper");
      priceWrapper.innerText = `$${price}`;

      const nameWrapper = document.createElement("div");
      nameWrapper.setAttribute("class", "name-wrapper");

      // CREATE RADIO BUTTONS
      const abRadio = document.createElement("input");
      abRadio.type = "radio";
      abRadio.name = item;
      abRadio.value = "alicia";
      abRadio.checked = true;
      abRadio.addEventListener("click", () => {
        updateName(item, abRadio.value, data);
      });

      const ibRadio = document.createElement("input");
      ibRadio.type = "radio";
      ibRadio.name = item;
      ibRadio.value = "ian";
      ibRadio.checked = false;
      ibRadio.addEventListener("click", () => {
        updateName(item, ibRadio.value, data);
      });

      const sharedRadio = document.createElement("input");
      sharedRadio.type = "radio";
      sharedRadio.name = item;
      sharedRadio.value = "shared";
      sharedRadio.checked = false;
      sharedRadio.addEventListener("click", () => {
        updateName(item, sharedRadio.value, data);
      });
      nameWrapper.append(abRadio, ibRadio, sharedRadio);

      itemRow.append(itemWrapper, priceWrapper, nameWrapper);
      mainWrapper.append(itemRow);
    });
  }

  function calculateTotals(data) {
    const abTotal = data.reduce((acc, curr) => {
      return curr.name === "alicia" ? acc + Number(curr.price) : acc;
    }, 0);
    const ibTotal = data.reduce((acc, curr) => {
      return curr.name === "ian" ? acc + Number(curr.price) : acc;
    }, 0);
    const sharedTotal = data.reduce((acc, curr) => {
      return curr.name === "shared" ? acc + Number(curr.price) : acc;
    }, 0);
    const abTotalDiv = document.querySelector("#abTotal");
    const ibTotalDiv = document.querySelector("#ibTotal");
    const sharedTotalDiv = document.querySelector("#sharedTotal");
    abTotalDiv.innerText = `$${abTotal.toFixed(2)}`;
    ibTotalDiv.innerText = `$${ibTotal.toFixed(2)}`;
    sharedTotalDiv.innerText = `$${sharedTotal.toFixed(2)}`;
  }

  async function updateName(item, name, data) {
    // console.log("item", item);
    // console.log("name", name);
    // console.log("stored data", data);

    const itemObj = data.find((obj) => obj.item === item);
    if (itemObj) {
      itemObj.name = name;
    }

    // Save the updated data back to storage
    await chrome.storage.local.set({ groceryData: data });
    console.log("Updated data:", data);
    calculateTotals(data);
  }
});
