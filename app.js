const BASE_URL = "https://cdn.moneyconvert.net/api/latest.json";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    const response = await fetch("https://cdn.moneyconvert.net/api/latest.json");
    const data = await response.json();

    let fromCode = fromCurr.value;
    let toCode = toCurr.value;

    let rateFrom = data.rates[fromCode];
    let rateTo = data.rates[toCode];

    if (!rateFrom || !rateTo) {
      msg.innerText = "Conversion rate not available!";
      return;
    }

    let finalAmount = (rateTo / rateFrom) * amtVal;
    msg.innerText = `${amtVal} ${fromCode} = ${finalAmount.toFixed(4)} ${toCode}`;

  } catch (err) {
    msg.innerText = "Error fetching exchange rates!";
    console.error(err);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});