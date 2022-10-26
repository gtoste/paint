import { Position } from "./Position";
import Shape from "./Shape";

export default class Line implements Shape{
    private color: string;
    private ctx: CanvasRenderingContext2D;

    private pos : Position;
    private last_pos : Position;
    private proportions : boolean;
    private r : number;

    constructor(ctx : CanvasRenderingContext2D, color : string, last_pos : Position, pos : Position, proportions : boolean, r : number) {
        this.ctx = ctx;
        this.color = color;
        this.last_pos = last_pos;
        this.pos =  pos;
        this.proportions = proportions;
        this.r = r;
    }
    draw(scale = 1){
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.r * scale;

        this.ctx.moveTo(this.last_pos.x * scale, this.last_pos.y * scale);
      if(this.proportions) {
        let width = Math.abs(this.last_pos.x - this.pos.x);
        let height = Math.abs(this.last_pos.y - this.pos.y);

        if(width > height){
          this.ctx.lineTo(this.pos.x * scale, this.last_pos.y * scale);
        }
        if(width <= height){
            this.ctx.lineTo(this.last_pos.x * scale, this.pos.y * scale);
        }
        this.ctx.stroke();
        return;
      }
      
      this.ctx.lineTo(this.pos.x * scale, this.pos.y * scale);
      this.ctx.stroke();
    }
}