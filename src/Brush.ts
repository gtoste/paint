import { Position, PositionsHis} from "./Position";
import Shape from "./Shape";

export default class Brush implements Shape {
    private positions : PositionsHis[] = []
    private color : string;
    private ctx;

    constructor(color : string, ctx : CanvasRenderingContext2D) {
        this.color = color
        this.ctx = ctx;
        this.positions = [];
    }

    public add(last_pos : Position, pos : Position){
        let row = {
            "last_pos" : last_pos,
            "pos" : pos
        }

        this.positions.push(row);
    }

    public draw(){
        for(let i = 0; i < this.positions.length; i++)
        {
            let last = this.positions[i].last_pos;
            let pos = this.positions[i].pos;
            this.ctx.strokeStyle = this.color;
            this.ctx.beginPath();
            this.ctx.lineCap = "round"
            this.ctx.moveTo(last.x, last.y);
            this.ctx.lineTo(pos.x, pos.y);
            this.ctx.stroke();
        }
    }
}