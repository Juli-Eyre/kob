/*地图
为了公平，后端Server生成地图，发给前端（两个玩家）展示
*/
import { AcGameObject } from "./AcGameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject{
    constructor(ctx,parent){//画布，画布的父元素(来动态地修改画布的长宽)
        super();//先执行基类的构造函数

        this.ctx=ctx;
        this.parent=parent;
        this.L=0;//格子的绝对距离
        this.rows=13;
        this.cols=14;

        this.inner_walls_count = 20;//里面障碍物的数量
        this.walls = [];//将障碍物Wall画到map地图中

        this.snakes=[
            new Snake({id:0, color:"#4876EC", r:this.rows-2, c:1}, this),//this这里就是地图的引用
            new Snake({id:1, color:"#F94848", r:1, c:this.cols-2}, this),//r行c列
        ];
    }

    //判断两条蛇是否是连通的：floodfill算法
    check_connectivity(g, sx, sy, tx, ty) {
        /*参数：当前地图g,起点和终点的横纵坐标*/
        if (sx == tx && sy == ty) return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i ++ ) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty))
                return true;
        }

        return false;
    }

    create_walls() {
        const g = [];
        for (let r = 0; r < this.rows; r ++ ) {
            g[r] = [];//布尔数组：初始全为false没有wall（无障碍）
            for (let c = 0; c < this.cols; c ++ ) {
                g[r][c] = false;
            }
        }

        // 给四周加上障碍物
        for (let r = 0; r < this.rows; r ++ ) {
            g[r][0] = g[r][this.cols - 1] = true;
        }
        for (let c = 0; c < this.cols; c ++ ) {
            g[0][c] = g[this.rows - 1][c] = true;
        }

        // 创建随机障碍物
        for (let i = 0; i < this.inner_walls_count / 2; i ++ ) {//轴对称只需要随机一半
            for (let j = 0; j < 1000; j ++ ) {
                let r = parseInt(Math.random() * this.rows);//取整像素而不是浮点数
                let c = parseInt(Math.random() * this.cols);
                // if (g[r][c] || g[c][r]) continue;
                if(g[r][c] || g[this.rows-1-r][this.cols-1-c]) continue;//由轴对称改为中心对称 x轴向下y轴向右
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)//左下角和右上角
                    continue;

                // g[r][c] = g[c][r] = true;
                g[r][c] = g[this.rows-1-r][this.cols-1-c]=true;
                break;
            }
        }
        //如果不连通，则重新生成
        const copy_g = JSON.parse(JSON.stringify(g));//先把状态复制一下
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2))
            return false;

        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));//因为wall是后push的，所以会覆盖掉前面的
                }
            }
        }

        return true;
    }
    add_listening_events(){//辅助函数用来绑定事件
        //先把canvas聚焦
        this.ctx.canvas.focus();

        const [snake0,snake1]=this.snakes;

        //获取用户信息，不一定是用户的输入，也可以是后端给前端发信息触发
        this.ctx.canvas.addEventListener("keydown",e=>{
            //direction:-1表示没有指令，0,1,2,3表示上右下左
            if(e.key=='w') snake0.set_direction(0);//上
            else if(e.key=='d') snake0.set_direction(1);
            else if(e.key=='s') snake0.set_direction(2);
            else if(e.key=='a') snake0.set_direction(3);
            else if(e.key=='ArrowUp') snake1.set_direction(0);
            else if(e.key=='ArrowRight') snake1.set_direction(1);
            else if(e.key=='ArrowDown') snake1.set_direction(2);
            else if(e.key=='ArrowLeft') snake1.set_direction(3);
        })
    }
    start() {
        for (let i = 0; i < 1000; i ++ ) //随机1000次总会成功的
            if (this.create_walls())
                break;

        this.add_listening_events();
    }

    update_size() { //求被playground构成的框框所包围的面积最大的正方形
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready(){//判断两条蛇是否都准备好下一回合了
        for(const snake of this.snakes){//对两条蛇进行判断
            if(snake.status!=="idle") return false;
            if(snake.direction===-1) return false;
        }
        return true;
    }
    next_step(){//让两条蛇进入下一回合
        for(const snake of this.snakes)
            snake.next_step();
    }
    check_valid(cell){//检测目标位置是否合法：是否撞到两条蛇的身体和障碍物
        for(const wall of this.walls){
            if(wall.r === cell.r && wall.c === cell.c) return false;
        }
        for(const snake of this.snakes){
            //判断蛇尾是否有缩的操作
            let k = snake.cells.length;
            if(!snake.check_tail_increasing()){//当蛇尾会前进的时候，蛇尾不要判断
                k--;
            }
            for(let i=0;i<k;i++){
                if(snake.cells[i].r===cell.r && snake.cells[i].c===cell.c) //已经撞上去了
                    return false;
            }
        }
        return true;
    }
    update() {
        this.update_size();

        if(this.check_ready()) this.next_step();

        this.render();//每帧都要渲染一次
    }

    render() {
        //地图的深浅两种颜色
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);//ccanvas坐标系
            }
        }
    }
}
