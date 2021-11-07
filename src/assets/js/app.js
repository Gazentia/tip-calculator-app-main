const resetBtn = document.querySelector("#resetBtn");
const inputs = {
  bill: document.querySelector("#billtInput"),
  people: document.querySelector("#peopletInput"),
  tip: document.querySelector("#customTipValue"),
  tipSelection: document.querySelector("#tipSelection"),
};

/* const tipSelection = document.querySelector("#tipSelection"); */
const inputValueObject = {
  bill: null,
  tip: null,
  people: null,
};

function autoDisableResetBtn() {
  for (const prop in inputValueObject) {
    if (inputValueObject[prop]) {
      resetBtn.removeAttribute("disabled");
      return;
    }
  }
  resetBtn.setAttribute("disabled", "");
}

function canCalcTip() {
  let result = true;
  for (const prop in inputValueObject) {
    if (!inputValueObject[prop]) {
      result = false;
      break;
    }
  }
  return result;
}

function convertFloat(num) {
  return parseFloat(parseFloat(num).toFixed(2));
}

function clearActiveSelection(inputElem) {
  const tipSelectionBtns = document.querySelectorAll("[data-tipvalue].active");
  if (tipSelectionBtns.length > 0) {
    tipSelectionBtns.forEach((elem) => {
      elem.classList.remove("active");
    });
  }
}

function clearInput(inputElem) {
  const parentElem = inputElem.closest(".form__control");
  const placholderMsg = parentElem.querySelector(".form__msg");
  placholderMsg.innerText = "";
  inputElem.value = "";
  inputElem.classList.remove("form__input--invalid", "form__input--valid");
}

function clearAllInputs() {
  for (const prop in inputs) {
    inputValueObjectReset(prop);
    clearInput(inputs[prop]);
  }
}

function validateHandlerInput(inputElem, validateResult) {
  const parentElem = inputElem.closest(".form__control");
  const placholderMsg = parentElem.querySelector(".form__msg");
  inputElem.classList.remove("form__input--invalid", "form__input--valid");
  inputElem.classList.add(validateResult.class);

  if (!validateResult.isValid) {
    placholderMsg.innerText = validateResult.msg;
  } else {
    placholderMsg.innerText = "";
  }
}

function calcTip(bill, tip, people) {
  const tipValue = convertFloat((bill * tip) / 100);
  const tipAmtPerson = convertFloat(tipValue / people);
  const totalAmt = tipValue + bill;
  const totalPerson = convertFloat(totalAmt / people);
  let isDone = true;
  if (!tipValue || !tipAmtPerson || !totalAmt || !totalPerson) {
    isDone = false;
  }
  return {
    tipValue: tipValue,
    tipAmtPerson: tipAmtPerson,
    totalAmt: totalAmt,
    totalPerson: totalPerson,
    isDone: isDone,
  };
}

function representResult() {
  const tipAmountElem = document.querySelector("#tipAmount");
  const tipTotalElem = document.querySelector("#tipTotal");

  if (!canCalcTip()) {
    tipAmountElem.innerText = "0.00";
    tipTotalElem.innerText = "0.00";
    return;
  }

  const calcResult = calcTip(
    inputValueObject.bill,
    inputValueObject.tip,
    inputValueObject.people
  );

  if (!calcResult.isDone) {
    tipAmountElem.innerText = "0.00";
    tipTotalElem.innerText = "0.00";
    return;
  }
  tipAmountElem.innerText = calcResult.tipAmtPerson;
  tipTotalElem.innerText = calcResult.totalPerson;
}

function validator(value, type) {
  const errorMsg = {
    float: "Can't be zero and characters.",
    number: "Can't be zero and characters.",
  };
  const numberPatts = {
    float: /^(([1-9]{1,1}\d*(\.\d{1,2})?)|(0{1,1}\.\d{1,2}))$/g,
    number: /^[1-9]{1}\d*$/g,
  };
  const result = {
    isValid: false,
    msg: null,
    class: "form__input--invalid",
  };
  if (!numberPatts[type].test(value)) {
    if (!errorMsg[type]) {
      return;
    }
    result.msg = errorMsg[type];
    return result;
  }
  result.isValid = true;
  result.msg = null;
  result.class = "form__input--valid";
  return result;
}

function inputValueObjectReset(target) {
  for (const prop in inputValueObject) {
    if (!target) {
      inputValueObject[prop] = null;
    }
    if (prop === target) {
      inputValueObject[prop] = null;
    }
  }
}

function resetBtnHanlder() {
  clearActiveSelection();
  clearAllInputs();
  resetBtn.setAttribute("disabled", "");
  representResult();
}

function tipSelectionHandler(e) {
  const target = e.target;
  let value = target.dataset.tipvalue;
  const validateResult = validator(value, "float");
  clearInput(inputs.tip);
  clearActiveSelection();
  if (!validateResult.isValid || !value) {
    inputValueObjectReset("tip");
    representResult();
    return;
  }
  target.classList.add("active");
  value = convertFloat(value);
  inputValueObject.tip = value;
  representResult();
}

function inputHandler(prop, validateType) {
  return function eventHandler(e) {
    const target = e.target;
    let value = target.value;
    const validateResult = validator(value, validateType);
    if (prop === "tip") {
      clearActiveSelection();
    }
    validateHandlerInput(target, validateResult);

    if (!value) {
      inputValueObjectReset(prop);
      representResult();
      clearInput(target);
    }

    if (!validateResult.isValid) {
      inputValueObjectReset(prop);
      representResult();
      return;
    }

    value = convertFloat(value);
    inputValueObject[prop] = value;
    autoDisableResetBtn();
    representResult();
  };
}

inputs.tipSelection.addEventListener("click", tipSelectionHandler);

inputs.bill.addEventListener("input", inputHandler("bill", "float"));

inputs.people.addEventListener("input", inputHandler("people", "number"));

inputs.tip.addEventListener("input", inputHandler("tip", "float"));

resetBtn.addEventListener("click", resetBtnHanlder);
