// 前10回合每步变长，从11回合开始每三步变长1步
import { AcGameObject } from "./AcGameObject";
import { Cell } from "./Cell";

export class Snake extends AcGameObject{
    constructor(info,gamemap){
        /*蛇的信息，地图*/
        super();

        this.id=info.id;
        this.color=info.color;
        this.gamemap=gamemap;

        //存放蛇的身体，cells[0]存放蛇头
        this.cells=[new Cell(info.r,info.c)]//初始时只有一个点
        this.next_cell=null;//下一步的目标位置

        this.speed=5;//蛇每秒钟走5个格子
        this.direction=-1;//-1表示没有指令，0,1,2,3表示上右下左
        this.status="idle";//idle表示静止，move表示正在移动,die表示死亡

        this.dr=[-1,0,1,0];//四个方向行的偏移量
        this.dc=[0,1,0,-1];//四个方向列的偏移量

        this.step=0;//回合数
        this.eps=1e-2;//判断是否重合允许的误差

        this.eye_direction=0;
        if(this.id===1) this.eye_direction=2;//左下角的蛇初始朝上，右上角的蛇朝下
        
        //蛇两个眼睛不同方向的偏移量
        this.eye_dx=[
            [-1,1],
            [1,1],
            [1,-1],
            [-1,-1]//朝左
        ];
        this.eye_dy=[
            [-1,-1],//朝上，右。下，左
            [-1,1],
            [1,1],
            [1,-1]
        ];
    }
    set_direction(d){
        this.direction=d;
    }
    check_tail_increasing(){//检测当前回合，蛇的长度是否增加；使整个蛇都可以动（之前只有蛇头可以动）
        if(this.step <= 10) return true;
        if(this.step%3 === 1) return true;
        return false;
    }
    start(){

    }

    next_step(){//将蛇的状态变为走下一步
        const d=this.direction;
        this.next_cell=new Cell(this.cells[0].r+this.dr[d], this.cells[0].c+this.dc[d]);
        //状态更新
        this.eye_direction=d;
        this.direction=-1;
        this.status="move";
        this.step++;

        //把每个小球都往后移动一位,头的那个位置不变=>相当于头部多了一个自己的复制
        const k=this.cells.length;
        for(let i=k;i>0;i--){
            this.cells[i]=JSON.parse(JSON.stringify(this.cells[i-1]));//要深层复制
        }

        //下一步操作撞到墙或者蛇了
        if(!this.gamemap.check_valid(this.next_cell)) 
            this.status = "die";
    }

    update_move(){
        //测试
        // this.cells[0].x += this.speed*this.timedelta/1000;//横坐标移动的距离=速度*每两帧间的时间间隔
        // //this.timedelta单位是毫秒
        //const move_distance = this.speed*this.timedelta/1000;//每两帧之间走过的距离
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance =Math.sqrt(dx*dx+dy*dy);

        if(distance < this.eps){//已经移动到目标点了，停止
            //添加一个新蛇头：把目标点存下来作为新的头
            this.cells[0]=this.next_cell;
            this.next_cell=null;
            this.status="idle";//走完了，停下来

            //若蛇不变长，需要把尾砍掉
            if(!this.check_tail_increasing()) this.cells.pop();
        }else{
            const move_distance = this.speed * this.timedelta /1000;
            this.cells[0].x += move_distance * dx / distance;//con,sin
            this.cells[0].y += move_distance * dy / distance;

            //如果蛇没有变长，则蛇需要走到下一个目的地
            if(!this.check_tail_increasing()){
                const length=this.cells.length;//蛇的长度
                const tail=this.cells[length-1], tail_target=this.cells[length-2];//蛇尾，下一步蛇尾的位置
                
                //将tail移到tail_target
                const tail_dx=tail_target.x-tail.x;
                const tail_dy=tail_target.y-tail.y;
                tail.x+=move_distance*tail_dx/distance;//每一帧蛇尾到目标点的距离和蛇头到目标点的距离是一样的(因此这里直接用了move,distance)
                tail.y+=move_distance*tail_dy/distance;
            }
        }
    }

    update(){//每一帧执行一次
        if(this.status==="move") this.update_move();
        this.render();
    }

    render(){
        const L=this.gamemap.L;
        const ctx=this.gamemap.ctx;

        ctx.fillStyle=this.color;

        if(this.status==="die") ctx.fillStyle="white";
        
        for(const cell of this.cells){
            ctx.beginPath();
            ctx.arc(cell.x*L, cell.y*L, L/2 *0.8, 0, Math.PI*2);
            ctx.fill();
        }

        //将由一个一个圆组成的蛇变得圆滑好看
        for(let i=1;i<this.cells.length;i++){
            const a=this.cells[i-1], b=this.cells[i];//组成的蛇的两个圆
            if(Math.abs(a.x-b.x) < this.eps && Math.abs(a.y-b.y) < this.eps) continue;//两个球重合了
            if(Math.abs(a.x-b.x) < this.eps) ctx.fillRect((a.x-0.5+0.1)*L, Math.min(a.y,b.y)*L, L*0.8, Math.abs(a.y-b.y)*L);//竖着的
            else ctx.fillRect(Math.min(a.x,b.x)*L, (a.y-0.5+0.1)*L, Math.abs(a.x-b.x)*L, L*0.8);//横着的
        }
        //蛇的眼睛
        ctx.fillStyle="black"
        for(let i=0;i<2;i++){
            const eye_x=this.cells[0].x*L+this.eye_dx[this.eye_direction][i]*L*0.15;
            const eye_y=this.cells[0].y*L+this.eye_dy[this.eye_direction][i]*L*0.15;
            // console.log(eye_x,eye_y);
            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L*0.04, 0, Math.PI*2)//圆：圆心坐标，半径，起始角度和中止角度
            ctx.fill();
        }
    }
}