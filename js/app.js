(function(){
    let app=document.querySelector('#app')
    app.addEventListener('touchstart',function (e){
        e.preventDefault()
    })
    document.documentElement.style.fontSize=document.documentElement.clientWidth/10+'px'
    window.onresize=function (){
        document.documentElement.style.fontSize=document.documentElement.clientWidth/10+'px'
    }

}());
//header部分
(function (){
    let header=app.querySelector('.header')
    let menus=header.querySelector('.menus')
    let menu=header.querySelector('.menu')
    let searchBtn=header.querySelector('.search-btn')
    //给频道菜单绑定切换类事件
    menu.addEventListener('touchstart',function (e){
        this.classList.toggle('open')
        menus.classList.toggle('open')
    })
    //让搜索框获得和失去焦点
    searchBtn.addEventListener('touchstart',function (e){
        searchBtn.focus()
        e.stopPropagation()
        e.preventDefault()
    })
    app.addEventListener('touchstart',function (){
      searchBtn.blur()
  })
}());
//contend部分
(function (){
    let contend=app.querySelector('.contend')
    let nav=contend.querySelector('.nav')
    let ul=nav.querySelector('.contend-menu')
    let lis=ul.querySelectorAll('li')
    let isMove=false//是否正在移动
   nav.addEventListener('touchstart',function (e){
        this.x=e.touches[0].clientX
        this.Left=transformCSS(ul,'translateX')
        ul.style.transition='none'
       this.startTime=Date.now()
    })
    nav.addEventListener('touchmove',function (e){
        this._x=e.touches[0].clientX
        this.newLeft=(this._x-this.x)+this.Left
        let translateX=transformCSS(ul,'translateX')
        let minLeft=-(ul.offsetWidth-nav.clientWidth)
        isMove=true

        if(translateX>0){
            this.newLeft=(this._x-this.x)/4+this.Left
        }
        if (translateX<minLeft){
            this.newLeft=minLeft+(this._x-this.x)/3
        }
        ul.style.transform=transformCSS(ul,'translateX',this.newLeft)
        e.stopPropagation()
    })
    nav.addEventListener('touchend',function (e){
        isMove=false
        isFirst=true
        ul.style.transition='transform 0.3s ease-out'
        //制造滑动完成后，导航栏会继续滑动一段距离的效果
        this._x=e.changedTouches[0].clientX
        this.endTime=Date.now()
        let disX=this._x-this.x;
        let Time=this.endTime-this.startTime
        let speed=disX/Time
        let translateX=transformCSS(ul,'translateX')
        translateX+=speed*100
        ul.style.transform=transformCSS(ul,'translateX',translateX)

        let minLeft=-(ul.offsetWidth-nav.clientWidth)
        if (translateX<minLeft){
            ul.style.transition='transform 0.5s cubic-bezier(.12,.63,.24,1.73)'
            ul.style.transform=transformCSS(ul,'translateX',minLeft)
        }
        if (translateX>0){
            ul.style.transition='transform 0.5s cubic-bezier(.12,.63,.24,1.73)'
            ul.style.transform=transformCSS(ul,'translateX',0)
        }
        e.stopPropagation()
    })
    lis.forEach(function (i){
        i.addEventListener('touchend',function (e){
            if (isMove) return ;
            lis.forEach(function (item){
                item.classList.remove('active')
            })
            this.classList.add('active')
        })

    })
    new Swiper('#lunBo')
})();
//floor区域
(function (){
    let floors=app.querySelectorAll('.floor')
    floors.forEach(function (floor){
        let video=floor.querySelector(".video")
        let span=floor.querySelector('.span')
        let lis=floor.querySelectorAll('.li')
        let v=new Swiper(video,{
            loop:false,
            pagination:false,
            auto:false,
            callback:{
                end:function (){
                    let key=v.container.getIndex()
                    let left=key*span.offsetWidth
                    let slides=video.querySelectorAll('.swiper-slide')
                    transformCSS(span,'translateX',left)
                    let dataSrc=slides[key].dataset.src
                    if (dataSrc==='1') return ;
                    setTimeout(function (){
                         slides[key].innerHTML=slides[0].innerHTML
                         slides[key].setAttribute('data-src','1')
                    },2000)
                }
            }
        })
        lis.forEach(function (li,key){
            li.addEventListener('touchstart',function (e){
                let left=key*span.offsetWidth
                transformCSS(span,'translateX',left)
                v.container.switchSlide(key)
                e.stopPropagation()
            })
        })


    })
})();
//页面滚动
(function (){
    window.onload=function () {
        new Scroll(app, '.box', {
            backgroundColor: 'rgba(42,28,28,0.3)',
            width: 4,
        })
    }
})()

