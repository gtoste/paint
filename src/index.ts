import { Canvas } from "./canvas";
import { Mode } from "./Mode";

//init
const canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
const mask : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("mask");

const option_download : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_download");
const option_clear : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_clear"); 
const option_previous : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_previous");

const option_color_red : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_color_red");
const option_color_blue : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_color_blue");
const option_color_green : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_color_green");
const option_color_yellow : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_color_yellow");
const color_picker : HTMLButtonElement = <HTMLButtonElement>document.getElementById("color_picker");
const option_brush : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_brush");
const option_rectangle : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_rectangle");
const option_circle : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_circle");
const option_line : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_line");
const option_proportions : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_proportions");
const option_fill : HTMLButtonElement = <HTMLButtonElement>document.getElementById("options_fill");
const option_range : HTMLInputElement = <HTMLInputElement>document.getElementById("range");


let c = new Canvas(canvas, mask);

let currently_selected_color : HTMLElement = option_color_red;
let currently_selected_mode : HTMLButtonElement = option_brush;
option_color_red.classList.add("selected");
option_brush.classList.add("selected");

const select_color = (color : string, csc : HTMLElement)=>
{
    c.setColor(color);
    currently_selected_color.classList.remove("selected");
    csc.classList.add("selected");
    currently_selected_color = csc;
}

const select_mode = (mode : Mode, csm : HTMLButtonElement) =>{
    c.setMode(mode);
    currently_selected_mode.classList.remove("selected");
    csm.classList.add("selected");
    currently_selected_mode = csm;
}

option_color_red.onclick = () =>{ select_color("red", option_color_red)}
option_color_blue.onclick = () =>{select_color("blue", option_color_blue)}
option_color_green.onclick = () =>{select_color("green", option_color_green)}
option_color_yellow.onclick = () =>{select_color("yellow", option_color_yellow)}
color_picker.onchange = () =>{select_color(color_picker.value, color_picker.parentElement)}
color_picker.onclick = () =>{select_color(color_picker.value, color_picker.parentElement)}

option_brush.onclick = () => {select_mode(Mode.brush, option_brush)}
option_rectangle.onclick = () => {select_mode(Mode.rectangle, option_rectangle)}
option_circle.onclick = () => {select_mode(Mode.circle, option_circle)}
option_line.onclick = () => {select_mode(Mode.line, option_line)}
option_proportions.onclick = ()=>{c.getProportions() ? option_proportions.classList.remove("selected") : option_proportions.classList.add("selected"); c.setProportions();}
option_fill.onclick = ()=>{c.getFill() ? option_fill.classList.remove("selected") : option_fill.classList.add("selected"); c.setFill();}


option_previous.onclick = ()=>{ c.undo(); }

option_clear.onclick = () => {c.clearCanvas() }

option_download.onclick = () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.click();
}

option_range.onchange = () =>{c.setRange(parseInt(option_range.value))}