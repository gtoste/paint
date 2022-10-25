import { Position } from "./Position";
import Shape from "./Shape";
export default class Rectangle implements Shape {
    private color: string;
    private ctx: CanvasRenderingContext2D;
    private width : number;
    private height : number;
    private last_pos : Position;
    private fill : boolean;

    constructor(ctx : CanvasRenderingContext2D, color : string, last_pos : Position, pos : Position, fill : boolean) {
        this.ctx = ctx;
        this.color = color;
        this.last_pos = last_pos;
        this.width =  pos.x - last_pos.x;
        this.height = pos.y - last_pos.y; 
        this.fill = fill;
    }
    draw(){
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        if(this.fill) 
        {
          this.ctx.fillStyle = this.color;
          this.ctx.fillRect(this.last_pos.x, this.last_pos.y, this.width, this.height)
        }else{
            this.ctx.rect(this.last_pos.x, this.last_pos.y, this.width, this.height);
        }
        this.ctx.stroke();
    }
}