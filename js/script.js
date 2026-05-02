"use strict";

const etchASketch = (() => {

  const sketchBoard = document.querySelector("#sketch-board");
  const gridToggler = document.querySelector("#grid-toggler");
  let gridSwitch = 1;

  function generateBoard(size) {
    for(let i = 0; i < size; i++) {
      const divRow = document.createElement("div");
      divRow.classList.add("square-row");
      for(let j = 0; j < size; j++) {
        const squareDiv = document.createElement("div");
        squareDiv.classList.add("square");
        divRow.appendChild(squareDiv);
      }
      sketchBoard.appendChild(divRow);
    }
  }

  function toggleGrid() {
    gridSwitch = gridSwitch === 0 ? 1 : 0;
    const rows = document.querySelectorAll(".square-row");
    for(const row of rows) () => row.style.setProperty("--grid-toggle", `${gridSwitch}px`);
    sketchBoard.style.setProperty("--grid-toggle", `${gridSwitch}px`);
  }

  generateBoard(16);
  gridToggler.addEventListener("click", toggleGrid);
})();
