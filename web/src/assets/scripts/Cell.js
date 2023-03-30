/*生成蛇*/
export class Cell{//构成蛇的格子
    constructor(r,c){
        //参数：横列坐标
        this.r=r;
        this.c=c;
        this.x=c+0.5;//格子的中点
        this.y=r+0.5;
    }
}