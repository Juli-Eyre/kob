const AC_GAME_OBJECTS=[]
export class AcGameObject {
    constructor(){
        AC_GAME_OBJECTS.push(this);
        this.has_called_start=false;//是否执行过
        /*移动的速度*/
        this.timedelta=0;//执行帧间的时间间隔
    }
    start(){//只执行一次

    }

    update(){//除了第一帧每帧执行一次
    }

    on_destroy(){//删除前执行
    }

    destroy(){//删除
        this.on_destroy();

        for(let i in AC_GAME_OBJECTS){
            const obj = AC_GAME_OBJECTS[i];
            if(obj===this){
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}
let last_timestamp;//上次执行的时刻

const step = timestamp => {//step传入参数：timestamp当前执行的时刻
    for (let obj of AC_GAME_OBJECTS){
        if(!obj.has_called_start) {
            obj.has_called_start=true;
            obj.start();
        }else{
            obj.timedelta=timestamp-last_timestamp;
            obj.update();
        }
    }
    last_timestamp=timestamp;
    requestAnimationFrame(step)
}
requestAnimationFrame(step)
