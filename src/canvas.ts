import { Mode } from "./Mode";
import Brush from "./Brush";
import { Position } from "./Position";
import Shape from "./Shape";
import Clear from "./Clear";

export class Canvas {
    private canvas : HTMLCanvasElement;
    private history : Shape[];
    private mode : Mode;
    private proportions : boolean;
    private fill : boolean;
    private ctx : CanvasRenderingContext2D;
    private r : number;
    private color : string;
    private last_pos : Position;

    constructor(canvas : HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.resize();
        document.body.onresize = this.resize;

        this.color = "red";
        this.r = 10;
        this.last_pos = null;
        this.history = []

        canvas.onmousedown = (es)=>{
          this.bindDraw(es);
        };
        canvas.onmouseup = ()=>{this.unbindDraw()}
        
        this.mode = Mode.brush;
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

    private bindDraw( ev:MouseEvent ){
      switch(this.mode)
      {
        case Mode.brush:
          let brush = new Brush(this.color, this.ctx);
          this.canvas.onmousemove = (ev)=>{
            //get possitions
            if(this.last_pos == null) this.last_pos = this.getMousePos(ev);
            let pos = this.getMousePos(ev);
            brush.add(this.last_pos, pos);
            this.draw(this.last_pos, pos);
          }
          this.history.push(brush);
        break;

        case Mode.rectangle:
          let rect = null;
          this.last_pos = this.getMousePos(ev);
          this.canvas.onmousemove = (me) =>{
            let pos = this.getMousePos(me)
            this.draw(this.last_pos, pos);
          }
        break;
      }
    }

    private unbindDraw(){
      this.canvas.onmousemove = null; 
      this.last_pos = null;
    }

    private draw(last_pos : Position, pos : Position){  
      switch(this.mode){
        case Mode.brush:
          this.ctx.strokeStyle = this.color;
          this.ctx.beginPath();
          this.ctx.lineCap = "round"
          this.ctx.moveTo(last_pos.x, last_pos.y);
          this.ctx.lineTo(pos.x, pos.y);
          this.ctx.stroke();
          this.last_pos = pos;
        break;

        case Mode.rectangle:
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.color;
          this.ctx.rect(last_pos.x, last_pos.y, pos.x - last_pos.x, pos.y - last_pos.y);
          this.ctx.stroke();
        break;
      }
    }


    public clear()
    {
      let width = document.body.offsetWidth;
      this.ctx.clearRect(0,0,width, 9/16 * width);
      this.history.push(new Clear);
    }

    public undo()
    {
      let width = document.body.offsetWidth;
      this.ctx.clearRect(0,0,width, 9/16 * width);

      this.history.pop();
      for(let i = 0; i < this.history.length; i++)
      {
        let obj = this.history[i];
        obj.draw();
      }
    }

    


    public setMode(mode : Mode){ this.mode = mode }
    public getMode(){ return this.mode }
    public setColor(color : string){this.color = color;}
    public setProportions(){ this.proportions = !this.proportions }
    public getProportions(){ return this.proportions }
    public setFill(){ this.fill = !this.fill }
    public getFill(){ return this.fill }
}