import { Position } from "./Position";
import Shape from "./Shape";
export default class Rectangle implements Shape {
    private color: string;
    private ctx: CanvasRenderingContext2D;
    private width : number;
    private height : number;
    private last_pos : Position;
    private fill : boolean;
    private proportions : boolean;
    private r : number;

    constructor(ctx : CanvasRenderingContext2D, color : string, last_pos : Position, pos : Position, fill : boolean, proportions : boolean, r : number) {
        this.ctx = ctx;
        this.color = color;
        this.last_pos = last_pos;
        this.width =  pos.x - last_pos.x;
        this.height = pos.y - last_pos.y; 
        this.fill = fill;
        this.proportions = proportions;
        this.r = r;
    }
    draw(scale = 1){
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.r * scale;
          if(this.proportions) {this.height = this.width >= this.height ? this.width : this.height; this.width = this.height;}
          if(this.fill) 
          {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.last_pos.x * scale, this.last_pos.y * scale, this.width * scale, this.height * scale)
          }else{
            this.ctx.rect(this.last_pos.x * scale, this.last_pos.y * scale, this.width * scale, this.height * scale)
            this.ctx.stroke();
          }
    }
}