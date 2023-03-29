/*轴对称地图*/
import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject{
    constructor(ctx,parent){//画布，画布的父元素(来动态地修改画布的长宽)
        super();//先执行基类的构造函数

        this.ctx=ctx;
        this.parent=parent;
        this.L=0;//格子的绝对距离
        this.rows=13;
        this.cols=13;

        this.inner_walls_count = 20;//里面障碍物的数量
        this.walls = [];//将障碍物Wall画到map地图中
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
                if (g[r][c] || g[c][r]) continue;
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2)//左下角和右上角
                    continue;

                g[r][c] = g[c][r] = true;
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

    start() {
        for (let i = 0; i < 1000; i ++ ) //随机1000次总会成功的
            if (this.create_walls())
                break;
    }

    update_size() { //求被playground构成的框框所包围的面积最大的正方形
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {
        this.update_size();
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
