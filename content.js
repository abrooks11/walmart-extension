console.log("content.js running");
const groceryList = [];
const defaultName = "alicia";

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
  price = price.includes(".") ? price.slice(1, price.indexOf(".") + 3) : price; // Keep only 2 decimal places
  groceryList.push({
    item: item,
    price: Number(price),
    name: defaultName,
  });
});

const extras = [
  ...document.querySelector(".bill-order-payment-spacing").children,
].filter((element) => {
  return (
    element.tagName.toLowerCase() === "div" &&
    element.className.includes("justify-between")
  );
});
console.log("extras", extras);

// for each element in the list, check if inner text === tax or driver tip
for (let i = 0; i < extras.length; i++) {
  const element = extras[i];
  let [name, price] = element.childNodes;

  if (name.innerText === "Tax" || name.innerText === "Driver tip") {
    console.log(price.innerText);
    price = price.innerText.includes(".")
      ? price.innerText.slice(1, price.innerText.indexOf(".") + 3)
      : price; // Keep only 2 decimal places
    groceryList.push({
      item: name.innerText,
      price: Number(price),
      name: defaultName,
    });
  }
}

console.log(groceryList);

// *SEND GROCERY ITEMS TO BACKGROUND SCRIPT
chrome.runtime.sendMessage({
  action: "sendData",
  data: groceryList,
});
console.log("data sent from content.js to background.js ", groceryList);
