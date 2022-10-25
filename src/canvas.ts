import { Mode } from "./Mode";

export class Canvas {
    private canvas : HTMLCanvasElement;
    private history : [Object];
    private mode : Mode;
    private color : string;
    private proportions : boolean;
    private fill : boolean;


    constructor(canvas : HTMLCanvasElement) {
        this.canvas = canvas;
        this.resize();
        document.body.onresize = this.resize;
        canvas.onmousedown = ()=>{canvas.onmousemove = this.draw};
        canvas.onmouseup = ()=>{canvas.onmousemove = null}
        
        this.mode = Mode.brush;
        this.color = "red";
        this.proportions = false;
        this.fill = false;
    }

    private resize(){
        let width = document.body.offsetWidth * 2/3;
        this.canvas.width = width;
        this.canvas.height = 9/16 * width;
    }

    private getMousePos(evt : MouseEvent) {
        var rect = this.canvas.getBoundingClientRect(), 
          scaleX = this.canvas.width / rect.width,    
          scaleY = this.canvas.height / rect.height;  
      
        return {
          x: (evt.clientX - rect.left) * scaleX,  
          y: (evt.clientY - rect.top) * scaleY   
        }
      }

    private draw(){
        console.log("test");
    }


    public setMode(mode : Mode){ this.mode = mode }
    public getMode(){ return this.mode }
    public setColor(color : string){ this.color = color }
    public getColor(){ return this.color }
    public setProportions(){ this.proportions = !this.proportions }
    public getProportions(){ return this.proportions }
    public setFill(){ this.fill = !this.fill }
    public getFill(){ return this.fill }
}