"use strict";

const etchASketch = (() => {

  const sketchBoard = document.querySelector("#sketch-board");
  const settingsPanel = document.querySelector("#settings-panel");
  const gridToggler = document.querySelector("#grid-toggler");
  const gridReset = document.querySelector("#grid-reset");
  const lowerResolution = document.querySelector("#grid-minus");
  const raiseResolution = document.querySelector("#grid-plus");
  const penColors = ["black", "white"];
  let gridResolution = 16;
  let gridSwitch = 1;

  function generateBoard(size) {
    for(let i = 0; i < size; i++) {
      const divRow = document.createElement("div");
      divRow.classList.add("square-row");
      for(let j = 0; j < size; j++) {
        const squareDiv = document.createElement("div");
        squareDiv.classList.add("square");
        squareDiv.setAttribute("data-axis", [i, j]);
        divRow.appendChild(squareDiv);
      }
      sketchBoard.appendChild(divRow);
    }
  }

  function toggleGrid() {
    gridSwitch = gridSwitch === 0 ? 1 : 0;
    sketchBoard.style.setProperty("--grid-toggle", `${gridSwitch}px`);
    sketchBoard.querySelectorAll(".square-row")
      .forEach( row => row.style.setProperty("--grid-toggle", `${gridSwitch}px`) );
    gridToggler.classList.toggle("active");
  }

  function resetGrid() {
    sketchBoard.querySelectorAll(".square-row").forEach( row => row.remove() );
    generateBoard(gridResolution);
  }

  function changeResolution(change) {
    if ( (gridResolution === 16 && change === -1) ||
      (gridResolution === 96 && change === 1) ) return;
    gridResolution += change * 16;
    document.querySelector("#grid-size").textContent = `${gridResolution} x ${gridResolution}`;
    resetGrid();
  }

  function evaluateSelection(ev) {
    const selection = ev.target.id;
    if (!selection) return;
    switch(selection) {
      case "grid-minus":
        changeResolution(-1);
        break;
      case "grid-plus":
        changeResolution(1);
        break;
      case "grid-reset":
        resetGrid();
        break;
      case "grid-toggler":
        toggleGrid();
        break;
      case "black-white":
      case "random-colors":
      case "grayscale":
      case "darken":
      case "brighten":
      case "rainbow":
      case "fire":
      case "ice":
        break;
    };
  }

  settingsPanel.addEventListener("click", evaluateSelection);
  sketchBoard.addEventListener("contextmenu", ev => ev.preventDefault());

  sketchBoard.addEventListener("mouseenter", ev => {
    if (!ev.target.dataset.axis || ev.buttons === 0) return;
    ev.target.classList.add("current");
    if (ev.buttons === 1 || ev.buttons === 2) {
      ev.target.style.backgroundColor = penColors[ev.buttons - 1];
    } 
  }, 1);
  sketchBoard.addEventListener("mousedown", ev => {
    if (!ev.target.dataset.axis || ev.buttons === 0) return;
    if (ev.buttons === 1 || ev.buttons === 2) {
      ev.target.style.backgroundColor = penColors[ev.buttons - 1];
    } 
  });
  sketchBoard.addEventListener("mouseleave", ev => {
    if (!ev.target.dataset.axis || ev.buttons === 0) return;
    ev.target.classList.remove("current");
  }, 1);
  
  generateBoard(gridResolution);

})();
