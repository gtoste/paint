import { Mode } from "./Mode";
import Brush from "./Brush";
import { Position } from "./Position";
import Shape from "./Shape";
import Clear from "./Clear";
import Rectangle from "./Rectangle";
import Circle from "./Circle";
import Line from "./Line";

export class Canvas {
    private canvas : HTMLCanvasElement;
    private mask : HTMLCanvasElement;
    private ctxCanvas : CanvasRenderingContext2D;
    private ctxMask : CanvasRenderingContext2D;

    private history : Shape[];
    private mode : Mode;
    private proportions : boolean;
    private fill : boolean;
    private r : number;
    private color : string;
    private last_pos : Position;
    private current_pos : Position;
    private width : number;

    constructor(canvas : HTMLCanvasElement, mask : HTMLCanvasElement) {
        this.canvas = canvas;
        this.mask = mask;
        this.ctxCanvas = canvas.getContext("2d");
        this.ctxMask = mask.getContext("2d");


        this.width = window.innerWidth * 2/3;
        
        this.color = "red";
        this.r = 10;
        this.last_pos = null;
        this.history = []
        this.mode = Mode.brush;
        this.proportions = false;
        this.fill = false;

        this.resize();
        window.onresize = ()=>{
          console.log("resoize")
          this.resize()}

        

       
        mask.onmousedown = (es)=>{
          this.bindDraw(es);
          es.preventDefault();
          this.mask.onmouseleave = () =>{
            if(this.mode == Mode.brush){
              this.last_pos = null;
              this.unbindDraw(); 
            }
          }
          this.mask.onmouseenter = (ev)=>{
            this.bindDraw(ev);
          }
        };
        document.body.onmouseup = () =>{
          if(this.mode != Mode.brush)
          this.unbindDraw(); 
          this.mask.onmouseenter = null;
          this.mask.onmouseleave = null;
        }

        mask.onmouseup = ()=>{
          this.unbindDraw(); 
          this.mask.onmouseenter = null;
          this.mask.onmouseleave = null;
        }
    }

    private resize(){
        let width = window.innerWidth * 2/3;
        let scale = width / this.width;
        this.canvas.width = width;
        this.canvas.height = 9/16 * width;
        this.mask.width = width;
        this.mask.height = 9/16 * width;
        this.redrawWithScale(scale)
    }

    private redrawWithScale(scale : number)
    {
      let width = window.innerWidth * 2/3;
      this.ctxCanvas.clearRect(0,0,width, 9/16 * width);

      for(let i = 0; i < this.history.length; i++)
      {
        let obj = this.history[i];
        obj.draw(scale);
      }
    }

    private getMousePos(evt : MouseEvent) {
        var rect = this.mask.getBoundingClientRect(), 
          scaleX = this.mask.width / rect.width,    
          scaleY = this.mask.height / rect.height;  
      
        return {
          x: (evt.clientX - rect.left) * scaleX,  
          y: (evt.clientY - rect.top) * scaleY   
        }
      }

    private bindDraw( ev:MouseEvent ){
      if(this.last_pos == null) this.last_pos = this.getMousePos(ev);
      switch(this.mode)
      {
        case Mode.brush:
          let brush = new Brush(this.color, this.ctxCanvas, this.r);
          this.mask.onmousemove = (ev) =>
          {
            let pos = this.getMousePos(ev);
            brush.add(this.last_pos, pos);
            this.drawBrush(this.last_pos, pos);
          }
          this.history.push(brush);
        break;

        case Mode.rectangle:
          this.mask.onmousemove = (me) =>
          {
            let pos = this.getMousePos(me);
            this.drawRect(this.last_pos, pos);
            this.current_pos = pos;
          }
        break;

        case Mode.circle:
          this.mask.onmousemove = (me) =>{
            let pos = this.getMousePos(me);
            this.drawCircle(this.last_pos, pos);
            this.current_pos = pos;
          }
        break;

        case Mode.line:
          this.mask.onmousemove = (me) =>{
            let pos = this.getMousePos(me);
            this.drawLine(this.last_pos, pos);
            this.current_pos = pos;
          }
        break;
      }
    }

    private unbindDraw(){
      if(this.mode == Mode.rectangle){
        let rect = new Rectangle(this.ctxCanvas, this.color, this.last_pos, this.current_pos, this.fill, this.proportions, this.r);
        this.history.push(rect);
      }else if(this.mode == Mode.circle){
        let circle = new Circle(this.ctxCanvas, this.color, this.last_pos, this.current_pos, this.fill, this.proportions, this.r);
        this.history.push(circle);
      }else if(this.mode == Mode.line){
        let line = new Line(this.ctxCanvas, this.color, this.last_pos, this.current_pos, this.proportions, this.r);
        this.history.push(line);
      }
    
      this.history[this.history.length-1].draw(); 
      this.mask.onmousemove = null; 
      this.last_pos = null;
      this.current_pos = null;
      this.clearMask();
    }

    private drawBrush(last_pos : Position, pos : Position)
    {
          this.ctxMask.strokeStyle = this.color;
          this.ctxMask.lineWidth = this.r;
          this.ctxMask.beginPath();
          this.ctxMask.lineCap = "round"
          this.ctxMask.moveTo(last_pos.x, last_pos.y);
          this.ctxMask.lineTo(pos.x, pos.y);
          this.ctxMask.stroke();
          this.last_pos = pos;
    }

    private drawRect(last_pos : Position, pos : Position)
    {
          this.clearMask();
          this.ctxMask.beginPath();
          this.ctxMask.strokeStyle = this.color;
          this.ctxMask.lineWidth = this.r;
        

          let width = pos.x - last_pos.x;
          let height = pos.y - last_pos.y;
          if(this.proportions) {height = width >= height ? width : height; width = height;}
          if(this.fill) 
          {
            this.ctxMask.fillStyle = this.color;
            this.ctxMask.fillRect(last_pos.x, last_pos.y, width, height)
          }else{
            this.ctxMask.rect(last_pos.x, last_pos.y, width, height)
            this.ctxMask.stroke();
          }
    }

    private drawCircle(last_pos : Position, pos : Position)
    {
      this.clearMask();
      let width = pos.x - last_pos.x;
      let height = pos.y - last_pos.y;
      let x_c = last_pos.x + width/2;
      let y_c = last_pos.y + height/2;
      this.ctxMask.strokeStyle = this.color;
      this.ctxMask.lineWidth = this.r;
      this.ctxMask.beginPath();

      if(this.proportions) {height = width >= height ? width : height; width = height;}
      this.ctxMask.ellipse(x_c, y_c, Math.abs(width/2), Math.abs(height/2), Math.PI, 0, 2 * Math.PI);
      if(this.fill) {
        this.ctxMask.fillStyle = this.color;
        this.ctxMask.fill();
      }
      else{
        this.ctxMask.stroke();
      }
    }

    private drawLine(last_pos : Position, pos : Position)
    {
      this.clearMask();
      this.ctxMask.strokeStyle = this.color;
      this.ctxMask.beginPath();


      this.ctxMask.moveTo(last_pos.x, last_pos.y);
      if(this.proportions) {
        let width = Math.abs(last_pos.x - pos.x);
        let height = Math.abs(last_pos.y - pos.y);

        if(width > height){
          this.ctxMask.lineTo(pos.x, last_pos.y);
        }
        if(width <= height){
            this.ctxMask.lineTo(last_pos.x, pos.y);
        }
        this.ctxMask.stroke();
        return;
      }
      
      this.ctxMask.lineTo(pos.x, pos.y);
      this.ctxMask.stroke();
    }

    public clearCanvas()
    {
      let width = document.body.offsetWidth;
      this.ctxCanvas.clearRect(0,0,width, 9/16 * width);
      this.history.push(new Clear);
    }

    public clearMask()
    {
      let width = window.innerWidth * 2/3;
      this.ctxMask.clearRect(0,0,width, 9/16 * width);
    }

    public undo()
    {
      let width = window.innerWidth * 2/3;
      this.ctxCanvas.clearRect(0,0,width, 9/16 * width);

      this.history.pop();
      for(let i = 0; i < this.history.length; i++)
      {
        let obj = this.history[i];
        obj.draw();
      }
    }

    public redo()
    {
      let width = window.innerWidth * 2/3;
      this.ctxCanvas.clearRect(0,0,width, 9/16 * width);

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
    public setRange(r : number){ this.r = r }
}