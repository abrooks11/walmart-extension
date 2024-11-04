console.log("content.js running");
const groceryList = [];

// *SCAN DOM FOR GROCERY ITEM WRAPPERS
const groceryItemWrappers = [
  ...document.querySelectorAll(".flex.flex-row"),
].filter((element) => {
  return element.className === "flex flex-row";
});

// *ITERATE THROUGH THE ITEM LIST AND PUSH OBJECT WITH TITLE AND COST AND NAME KEYS TO GROCERY LIST
groceryItemWrappers.forEach((element) => {
  //   console.log(element.childNodes);
  // NEED TO DESTRUCTURE CHILD NODES FROM WRAPPER
  const [itemWrapper, priceWrapper] = element.childNodes;
  const item = [...itemWrapper.childNodes][0].innerText;
  let price = [...priceWrapper.childNodes][0].innerText;
  let defaultName = "alicia";
  price = price.includes(".") ? price.slice(1, price.indexOf(".") + 3) : price; // Keep only 2 decimal places
  groceryList.push({
    item: item,
    price: price,
    name: defaultName,
  });
});
console.log(groceryList);

// *SEND GROCERY ITEMS TO BACKGROUND SCRIPT
chrome.runtime.sendMessage({
  action: "sendData",
  data: groceryList,
});
console.log("data sent from content.js to background.js ", groceryList);
