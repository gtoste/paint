import Shape from "./Shape";
import { Position } from "./Position";

export default class Circle implements Shape{
    private color: string;
    private ctx: CanvasRenderingContext2D;
    private width : number;
    private height : number;
    private last_pos : Position;
    private fill : boolean;
    private proportions : boolean;
    private r : number;

    constructor(ctx : CanvasRenderingContext2D, color : string, last_pos : Position, pos : Position, fill : boolean, proportions : boolean, r : number)
    {
        this.ctx = ctx;
        this.color = color;
        this.last_pos = last_pos;
        this.width =  pos.x - last_pos.x;
        this.height = pos.y - last_pos.y; 
        this.fill = fill;
        this.proportions = proportions;
        this.r = r;
    }

    draw(scale = 1): void {
      let x_c = this.last_pos.x + this.width/2;
      let y_c = this.last_pos.y + this.height/2;
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.r * scale;
      this.ctx.beginPath();

      if(this.proportions) {this.height = this.width >= this.height ? this.width : this.height; this.width = this.height;}
      this.ctx.ellipse(
        x_c * scale, 
        y_c * scale, 
        Math.abs(this.width/2) * scale, 
        Math.abs(this.height/2) * scale, Math.PI, 0, 2 * Math.PI);
      if(this.fill)
      {
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
      }else{
        this.ctx.stroke();
      }
    }

}