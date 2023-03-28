import { AcGameObject } from "./AcGameObject";

export class GameMap extends AcGameObject{
    constructor(ctx,parent){//画布，画布的父元素(来动态地修改画布的长宽)
        super();//先执行基类的构造函数

        this.ctx=ctx;
        this.parent=parent;
        this.L=0;//格子的绝对距离
        this.rows=13;
        this.cols=13;
    }

    start(){

    }
    //求被playground构成的框框所包围的面积最大的正方形
    updata_size(){
        this.L=Math.min(this.parent.clientWidth/this.cols, this.parent.clientHeight/this.rows);
        this.ctx.canvas.width=this.L*this.cols;
        this.ctx.canvas.height=this.L*this.rows;
    }
    update(){
        this.update_size();
        this.render();//每帧都要渲染一次
    }

    render(){
        this.ctx.fillstyle='green';
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}