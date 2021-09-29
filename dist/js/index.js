"use strict";

class Calc {
  #nav = document.querySelector(".calc-theme__nav");
  #body = document.querySelector("body");
  #dotsContiner = document.querySelector(".calc-theme-sel");
  #screen = document.querySelector(".display-screen");
  #keysContainer = document.querySelector(".keys-container");
  constructor() {
    this.#nav.addEventListener("click", this.navThemeToggler.bind(this));
    this.#keysContainer.addEventListener("click", this.calculate.bind(this));
  }

  navThemeToggler(e) {
    const btn = e.target.closest(".toggler");
    if (!btn) return;
    this.#body.classList.remove("theme-1", "theme-2", "theme-3");
    const {tap} = btn.dataset;
    this.#dotsContiner.querySelectorAll(".dot").forEach((dot) => {
      dot.style.opacity = 0;
    });
    const activeDot = this.#dotsContiner.querySelector(`[data-tap='${tap}']`);
    activeDot.style.opacity = 1;
    this.#body.classList.add(`${tap}`);
  }
  calculate(e) {
    const key = e.target.closest(".key");
    if (!key) return;
    const diplayValue = this.#screen.textContent;
    const keyValue = key.textContent;
    const {type} = key.dataset;
    const {prevKeyType} = e.currentTarget.dataset;
    const currentEl = e.currentTarget;
    const selected = currentEl.querySelector(`[data-state="selected"]`);

    if (type === "number") this.checkNum(diplayValue, keyValue, prevKeyType);

    if (type === "operator")
      this.checkOperator(currentEl, diplayValue, type, key);

    if (type === "equals") {
      if (!selected) return;
      this.#screen.textContent = this.CalcSome(currentEl, diplayValue, key);
      selected.dataset.state = "";
    }

    if (type === "delete") {
      if (diplayValue === "0") return;
      const hasAttributeFirstNum = currentEl.hasAttribute("data-first-num");
      const hasAttributeSecondtNum = currentEl.hasAttribute("data-second-num");
      const second = [...diplayValue];
      const firstNum = currentEl.hasAttribute("data-first-num")
        ? [...currentEl.dataset.firstNum]
        : 0;
      if (!hasAttributeFirstNum && !hasAttributeSecondtNum)
        this.deleteNum(second, 0);
      else if (hasAttributeFirstNum && firstNum.join() !== second.join())
        this.deleteNum(second, currentEl.dataset.firstNum);
      else this.deleteNum(firstNum, 0, currentEl);
      this.removeOperator(selected);
    }

    currentEl.dataset.prevKeyType = type;
  }

  CalcSome(current, diplayValue) {
    const {firstNum} = current.dataset;
    current.dataset.secondNum = diplayValue;
    const {secondNum} = current.dataset;
    console.log(secondNum);
    const operator = current.querySelector(
      `[data-state="selected"]`
    )?.textContent;

    if (operator === "+") return +firstNum + +secondNum;
    if (operator === "-") return +firstNum - +secondNum;
    if (operator === "x") return +firstNum * +secondNum;
    if (operator === "/") return +firstNum / +secondNum;
  }

  checkNum(diplayValue, keyValue, prevKeyType) {
    diplayValue === "0"
      ? (this.#screen.textContent = keyValue)
      : prevKeyType === "operator"
      ? (this.#screen.textContent = keyValue)
      : (this.#screen.textContent = `${diplayValue}${keyValue}`);
  }
  checkOperator(current, diplayValue, type, key) {
    current
      .querySelectorAll(`[data-type="${type}"]`)
      .forEach((el) => (el.dataset.state = ""));
    key.dataset.state = "selected";
    current.dataset.firstNum = diplayValue;
  }
  removeOperator(selected) {
    selected !== null && selected?.getAttribute("data-state")
      ? (selected.dataset.state = "")
      : "";
  }

  deleteNum(arr, value, el = "") {
    arr.splice(-1, 1);
    !arr.length
      ? (this.#screen.textContent = `${value}`)
      : (this.#screen.textContent = arr.join(""));
    if (el) el.dataset.firstNum = arr.splice(-1, 1);
  }
}

new Calc();
