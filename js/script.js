"use strict";

const etchASketch = (() => {

  const sketchBoard = document.querySelector("#sketch-board");
  const settingsPanel = document.querySelector("#settings-panel");
  const gridToggler = document.querySelector("#grid-toggler");
  const drawModes = [monoChrome, random, luminance, oscillate];
  const defaultHSL = [0, 0, 0];
  const defltHSLBG = [0, 0, 100];
  const isDark = () => document.body.classList.contains("dark");
  let currentHSL = [0, 0, 0];
  let currHSLBG = [0, 0, 100];
  let gridResolution = 16;
  let gridVisible = 1;
  let currentMode = 0;
  let scaleDirection = true;
  let oscParams = [];

  function changeTheme() {
    toggleThemeClass();
    const squares = document.querySelectorAll(".square");
    squares.forEach( square => {
      const squareCol = rgbToHsl(stripRGBString(square.style.backgroundColor));
      if (squareCol.every( (item, index) => item === defaultHSL[index])) {
        square.style.backgroundColor = generateHSLString(defltHSLBG);
      } else if (squareCol.every( (item, index) => item === defltHSLBG[index])) {
        square.style.backgroundColor = generateHSLString(defaultHSL);
      }
    });
  }

  function toggleThemeClass() {
    const elements = document.querySelectorAll("body *");
    elements.forEach( elem => elem.classList.toggle("dark"));
    document.body.classList.toggle("dark");
    currHSLBG = isDark() ? [...defaultHSL] : [...defltHSLBG];
  }

  function generateBoard(size) {
    currHSLBG = isDark() ? [...defaultHSL] : [...defltHSLBG];
    for(let i = 0; i < size; i++) {
      const divRow = document.createElement("div");
      divRow.classList.add("square-row");
      for(let j = 0; j < size; j++) {
        const squareDiv = document.createElement("div");
        squareDiv.classList.add("square");
        squareDiv.style.backgroundColor = generateHSLString(currHSLBG);
        divRow.appendChild(squareDiv);
      }  
      sketchBoard.appendChild(divRow);
    }  
  }  

  function changeResolution(change) {
    if ( (gridResolution === 16 && change === -16) ||
      (gridResolution === 96 && change === 16) ) return;
    gridResolution += change;  
    document.querySelector("#grid-size").textContent = `${gridResolution} x ${gridResolution}`;
    clearBoard();
  }  

  function clearBoard() {
    sketchBoard.querySelectorAll(".square-row").forEach( row => row.remove() );
    generateBoard(gridResolution);
  }    

  function toggleGrid() {
    gridVisible = gridVisible === 0 ? 1 : 0;
    sketchBoard.style.setProperty("--grid-toggle", `${gridVisible}px`);
    sketchBoard.querySelectorAll(".square-row")
      .forEach( row => row.style.setProperty("--grid-toggle", `${gridVisible}px`));
    gridToggler.classList.toggle("active");      
  }      

  function monoChrome(ev) {
    if (ev.buttons === 1) {
      currentHSL = isDark() ? [...defltHSLBG] : [...defaultHSL];
    } else {
      currentHSL = isDark() ? [...defaultHSL] : [...defltHSLBG];
    }
    ev.target.style.backgroundColor = generateHSLString(currentHSL);
  }

  function random(ev) {
    if (ev.buttons === 1) {
      currentHSL = [
        Math.floor(Math.random() * 360),
        Math.floor(Math.random() * 76) + 25,
        Math.floor(Math.random() * 76) + 25
      ];
    } else {
      currentHSL = isDark() ? [...defaultHSL] : [...defltHSLBG];
    }
    ev.target.style.backgroundColor = generateHSLString(currentHSL);
  }

  function luminance(ev) {
    currentHSL = rgbToHsl(stripRGBString(ev.target.style.backgroundColor));
    if (ev.buttons === 1) {
      currentHSL[2] >= 11 ? currentHSL[2] -= 10 : currentHSL[2] = 1;      
    } else {
      currentHSL[2] <= 89 ? currentHSL[2] += 10 : currentHSL[2] = 99;
    }
    ev.target.style.backgroundColor = generateHSLString(currentHSL);
  }

  function oscillate(ev) {
    if(ev.buttons === 2) {
      currentHSL = isDark() ? [...defaultHSL] : [...defltHSLBG];
    } else {
      let osc, step, lo, hi;
      [currentHSL, osc, step, lo, hi] = [...oscParams];
      if (scaleDirection && currentHSL[osc] <= hi) {
        currentHSL[osc] += step;
      } else if (!scaleDirection && currentHSL[osc] >= lo) {
        currentHSL[osc] -= step;
      } else {
        scaleDirection = !scaleDirection;
      }  
    }  
    ev.target.style.backgroundColor = generateHSLString(currentHSL);
  }

  function customColor(ev) {}

  function handleSketchBoardEvent(ev) {
    if (ev.type === "pointerenter") {
      ev.target.classList.add("current");
      drawModes[currentMode](ev);
    } else if (ev.type === "pointerleave") {
      ev.target.classList.remove("current")
    } else {
      drawModes[currentMode](ev);
    }
  }

  function evaluateSelection(ev) {
    const selection = ev.target.classList.contains("square") ? "square" : ev.target.id;    
    if (!selection) return;
    switch(selection) {
      case "square":
        ev.preventDefault();
        if (!(ev.buttons === 1 || ev.buttons === 2)) break;
        handleSketchBoardEvent(ev);
        break;
      case "grid-minus":
        changeResolution(-16);
        break;
      case "grid-plus":
        changeResolution(16);
        break;
      case "clear-board":
        clearBoard();
        break;
      case "grid-toggler":
        toggleGrid();
        break;
      case "monochrome":
      case "random":
      case "luminance":
        currentMode = ev.target.value;
        break;
      case "grayscale":
        currentMode = ev.target.value;
        oscParams = ([[0, 0, 50], 2, 10, 11, 89]);
        break;
      case "rainbow":
        currentMode = ev.target.value;
        oscParams = ([[180, 100, 50], 0, 10, 11, 349]);
        break;
      case "fire":
        currentMode = ev.target.value;
        oscParams = ([[30, 100, 50], 0, 3, 3, 57]);
        break;
      case "ice":
        currentMode = ev.target.value;
        oscParams = ([[207, 100, 50], 0, 3, 167, 242]);
        break;
      case "picker":
        break;
    };
  }

  function rgbToHsl(r, g, b) {
    if (Array.isArray(r)) [r, g, b] = [...r];
    [r, g, b] = [r / 255, g / 255, b / 255];
    const cMax = Math.max(r, g, b);
    const cMin = Math.min(r, g, b);
    const lumina = (cMax + cMin) / 2;
    const l = Math.round(lumina * 100);
    const saturation = !(cMax - cMin) ? 0 :
        lumina <= 0.5 ?
        (cMax - cMin) / (cMax + cMin) :
        (cMax - cMin) / (2.0 - cMax - cMin);
    const s = Math.round(saturation * 100);
    const hue = !s ? 0 :
        r === cMax ? (g - b) / (cMax - cMin) :
        g === cMax ? 2.0 + (b - r) / (cMax - cMin) :
        4.0 + (r - g) / (cMax - cMin);
        const h = hue < 0 ? Math.round(hue * 60) + 360 : Math.round(hue * 60);
    return [h, s, l];
  }

  function generateHSLString(h, s, l) {
    if(Array.isArray(h)) [h, s, l] = [...h];
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  function stripRGBString(rgbStr) {
    return rgbStr.slice(4, -1).split(", ").map(num => Number(num));
  }

  settingsPanel.addEventListener("click", evaluateSelection);
  sketchBoard.addEventListener("pointerenter", evaluateSelection, true);
  sketchBoard.addEventListener("pointerdown", evaluateSelection);
  sketchBoard.addEventListener("pointerleave", evaluateSelection, true);
  sketchBoard.addEventListener("contextmenu", ev => ev.preventDefault());
  document.querySelector("#theme-toggle").addEventListener("click", changeTheme);

  generateBoard(gridResolution);

})();