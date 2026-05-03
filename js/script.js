"use strict";

const etchASketch = (() => {

  const sketchBoard = document.querySelector("#sketch-board");
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
  }

  function resetGrid() {
    sketchBoard.querySelectorAll(".square-row").forEach( row => row.remove() );
    generateBoard(gridResolution);
  }

  generateBoard(gridResolution);

  sketchBoard.addEventListener("contextmenu", ev => ev.preventDefault());
  gridToggler.addEventListener("click", toggleGrid);
  gridReset.addEventListener("click", resetGrid);

  lowerResolution.addEventListener("click", ev => {
    if (gridResolution === 16) return;
    gridResolution -= 16;
    document.querySelector("#grid-size").textContent = `${gridResolution} x ${gridResolution}`;
    resetGrid();
  });
  raiseResolution.addEventListener("click", ev => {
    if (gridResolution === 96) return;
    gridResolution += 16;
    document.querySelector("#grid-size").textContent = `${gridResolution} x ${gridResolution}`;
    resetGrid();
  });

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

})();
