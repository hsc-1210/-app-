//依赖tweenAnimation.js与transformCss.js
function Scroll(container,el,props,callback){
     el=typeof el ==='object'?el: document.querySelector(el)
    container=typeof container ==='object'? container:document.querySelector(container)
    //初始化scrollBar
    let scrollBar=null

    //绑定touchstart事件
    el.addEventListener('touchstart',function (e){
        this.y=e.touches[0].clientY
        this.timeStart=Date.now()
        this.translateY=transformCSS(el,'translateY')
        //实现即点即停
        el.timer && el.timer['translateY'] && clearInterval(el.timer['translateY'])
        scrollBar.timer && el.timer['translateY'] && clearInterval(scrollBar.timer['translateY'])
    })
    //绑定touchmove事件
    el.addEventListener('touchmove',function (e){
        this._y=e.touches[0].clientY
        let translateY=this._y-this.y+this.translateY
        //设置el的translateY值
        transformCSS(el,'translateY',translateY)
        //获取el和el包含元素的高度
        let elHeight=el.offsetHeight
        let parentHeight=container.offsetHeight

        let distance=-translateY/elHeight*parentHeight

        transformCSS(scrollBar,'translateY',distance)
    })
    //绑定touchend事件
    el.addEventListener('touchend',function (e){
        let _y=e.changedTouches[0].clientY
        let time=Date.now()-this.timeStart
        let v=(_y-this.y)/time
        let s=v*120
        //获取el当前的translateY
        let elCurrentTranslateY=transformCSS(el,'translateY')
        //设置快速滑动后translateY的路程
        let translateY=elCurrentTranslateY+s
        //初始化活动效果变量
        var type='easeOut'
        if (translateY>=0){
            translateY = 0
            type ='backEaseOut'
        }
        //获取内容区活动最小 translateY
        let minDistance= container.offsetHeight-el.offsetHeight
        if (translateY<=minDistance){
            translateY = minDistance
            type ='backEaseOut'
        }
        //获取scrollBar当前的translateY
        let scrollBarCurrentTranslateY=transformCSS(scrollBar,'translateY')
        //计算scrollBar的translateY
        let distance=-translateY/el.offsetHeight*container.offsetHeight
        //执行tweenAnimation动画
        tweenAnimation(el,'translateY',elCurrentTranslateY,translateY,500,10,type)
        tweenAnimation(scrollBar,'translateY',scrollBarCurrentTranslateY,distance,500,10,type)

    })
    el.init=function (){
        scrollBar=document.createElement("div")
        //初始化scrollBar的宽度
        let width=props&&props.width?props.width:5
        //初始化scrollBar的borderRadius
        let borderRadius=props&&props.borderRadius?props.borderRadius:(width/2)
        //初始化scrollBar的位置
        let position=props && props.position?props.position:{right:0,top:0}
        //初始化scrollBar的背景颜色
        let color=props&&props.backgroundColor?'rgba(123, 114, 114, 0.4)':props.color
        //设置scrollBar的宽度
        scrollBar.style.width=width+'px'
        //设置scrollBar的border样式
        scrollBar.style.borderRadius=borderRadius+'px'
        //设置scrollBar的背景颜色
        scrollBar.style.backgroundColor=color
        //设置scrollBar的位置
        for (let i in position){
            if (position.hasOwnProperty(i)){
                scrollBar.style[i]=position[i]
            }
        }
        //设置el相对定位
       container.style.position='relative'
        //设置scrollBar绝对定位
        scrollBar.style.position='absolute'
        //插入类
        scrollBar.className='scrollBar'
        //插入scrollBar到el
        container.appendChild(scrollBar);
        //设置scrollBar的高度
        scrollBar.style.height=Math.pow(container.offsetHeight,2)/el.offsetHeight+"px"
    }
    el.init()
    //判断回调存在与执行
    callback && callback()
}