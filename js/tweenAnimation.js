/*
* 参数说明：
el: 元素对象；
style:设置的属性；
start: 初始值，元素的初始位置；
end: 结束值，元素的结束位置
duration：持续时间,整个过渡持续时间
interval:时间间隔
type:Elastic和Back 的可选参数。回弹系数,s值越大.回弹效果越远。
* */
function tweenAnimation(el,style,start,end,duration,interval,type){
    let tween={
        /*
        t: current time：当前时间；
        b: beginning value：初始值，元素的初始位置；
        c: change in value：变化量，元素的结束位置与初始位置距离差
        d: duration：持续时间,整个过渡持续时间
        s：Elastic和Back 的可选参数。回弹系数,s值越大.回弹效果越远。
        */
        Linear: function(t,b,c,d){ return c*t/d + b; },
        easeIn: function(t,b,c,d){
            return c*(t/=d)*t + b;
        },
        easeOut: function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function(t,b,c,d){
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        backEaseOut: function (t, b, c, d, s) {
            if (s === undefined) s = 2.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
    }
    type = type===undefined?'Linear':type
    let time = 0
    let change = end - start
    el=typeof el==='object'?el:document.querySelector(el)
    if (el.timer===undefined){
        el.timer = {}
    }
    el.timer[style]=setInterval(function (){
        if (time>=duration){
            clearInterval(el.timer[style])
            return
        }
        time+=interval
        let v=tween[type](time,start,change,duration)
        switch (style){
            case 'left':
            case 'top':
            case 'width':
            case 'height':
                el.style[style]=v+'px'
                break;
            case 'translateX':
            case 'translateY':
            case 'translateZ':
            case 'translate':
            case 'rotateX':
            case 'rotateY':
            case 'rotateZ':
            case 'scale':
            case 'scaleX':
            case 'scaleY':
            case 'scaleZ':
                transformCSS(el,style,v)
                break;
            case 'opacity':
                el.style[style]=v
                break;
        }
    },time)

}