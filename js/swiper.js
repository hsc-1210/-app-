(function (w){
        function Swiper(selector, options) {
            let auto = options && options.auto !== undefined ? options.auto : true;
            let loop = options && options.loop !== undefined ? options.loop : true;
            let time = options && options.time !== undefined ? options.time : 2000;
            let page = options && options.pagination !== undefined ? options.pagination : true;
            let container;
            // let callback = options ? (options.callback || false) : false;
            //获取元素  isDown
            if(typeof selector === 'string'){
               container = document.querySelector(selector);
            }
            if(typeof selector === 'object'){
                container = selector;
            }

            let wrapper = container.querySelector('.swiper-wrapper');
            let index = 0;//当前显示的幻灯片的下标
            let dots = null;
            let len = container.querySelectorAll('.swiper-slide').length;// 5
            let pagination = container.querySelector('.swiper-pagination');
            let timer = null;
            if (loop) {
                //无缝滚动
                wrapper.innerHTML += wrapper.innerHTML;
            }
            let length = container.querySelectorAll('.swiper-slide').length;// 5
            //标识变量
            let isHori = true;// is 是否  hori  水平
            let isFirst = true;// first 第一次

            //触摸开始事件
            container.addEventListener('touchstart', function (e) {
                wrapper.style.transition = 'none';
                //获取按下时的时间点
                this.touchstartTime = Date.now();

                //判断无缝滚动
                if (loop) {
                    //判断 无缝滚动的幻灯片
                    if (index === 0) {
                        index = len;
                        container.switchSlide(index, false);
                    }

                    //右侧边界
                    if (index === length - 1) {
                        index = len - 1;
                        container.switchSlide(index, false);
                    }
                }
                //获取触摸开始时的触点位置
                this.x = e.touches[0].clientX;
                this.y = e.touches[0].clientY;
                //获取包裹元素的水平偏移量
                // this.left = wrapper.offsetLeft;// translateX 的偏移值
                //获取元素的 transform 样式值
                this.left = transformCSS(wrapper, 'translateX');
                //停止定时器
                clearInterval(timer);
                options && options.callback && typeof options.callback.start === 'function' && options.callback.start();

            });

            //触摸滑动时事件
            container.addEventListener('touchmove', function (e) {
                //获取当前的触点位置
                this._x = e.touches[0].clientX;
                //获取移动后的触点位置
                this._y = e.touches[0].clientY;

                //垂直方向上的偏移
                let disY = Math.abs(this._y - this.y);
                let disX = Math.abs(this._x - this.x);

                if (isFirst) {
                    //标识变量赋值为 假
                    isFirst = false;
                    //判断方向
                    if (disY > disX) {
                        isHori = false;
                    }

                    if (disY < disX) {
                        isHori = true;
                    }
                }
                //判断方向 决定是否阻止默认行为
                if (isHori) {
                    e.stopPropagation()
                    e.preventDefault();
                } else {
                    return;
                }

                //计算新的left 值
                let newLeft = this._x - this.x + this.left;
                //设置 left 的值
                // wrapper.style.left = newLeft + 'px';
                //设置元素的 translateX 样式
                // wrapper.style.transform = 'translateX('+newLeft+'px)';
                transformCSS(wrapper, 'translateX', newLeft);
                options && options.callback && typeof options.callback.move === 'function' && options.callback.move();
                e.stopPropagation()
            });

            //触摸结束事件
            container.addEventListener('touchend', function (e) {
                //重新赋值变量
                isFirst = true;
                //启动定时器
                this.autoRun();
                //如果是垂直滑动
                if (!isHori) return;
                //获取触摸结束时触点位置
                this._x = e.changedTouches[0].clientX;
                //判断距离
                let disX = Math.abs(this._x - this.x);
                //判断时间
                this.touchendTime = Date.now();
                if (disX > container.offsetWidth / 2 || this.touchendTime - this.touchstartTime <= 300) {
                    // 向左滑动
                    if (this._x < this.x) {
                        index++
                    }
                    //
                    if (this._x > this.x) {
                        index--;
                    }
                }
                //检测是否越界
                if (index < 0) {
                    index = 0;
                }

                if (index > length - 1) {
                    index = length - 1;
                }

                // index   =>  left 的关系
                // 0      1       2      N
                // 0    -375    -750    -375*N
                //增加过渡
                this.switchSlide(index);
            });

            //动画过渡完毕事件  transitionend
            loop && wrapper.addEventListener('transitionend', function () {
                //是不是最后一张幻灯片
                if (index === length - 1) {
                    //移除过渡
                    index = len - 1;
                    container.switchSlide(index, false);
                }
            });

            //初始化
            container.init = function () {
                //设置容器元素的相对定位
                container.style.position = 'relative';
                //获取第一个幻灯片的高度
                let slides = container.querySelectorAll('.swiper-slide');
                //容器设置 高度
                window.addEventListener('load', function () {
                    let h = slides[0].offsetHeight;
                    //设置容器的高度
                    container.style.height = h + 'px';
                });

                //包裹元素的宽度设置
                wrapper.style.width = length * 100 + '%';

                //设置子元素的宽度
                slides.forEach(function (slide) {
                    //设置宽度
                    slide.style.width = 100 / length + '%';
                });

                //如果设置为真 则创建导航点
                if (page) {
                    //根据幻灯片数量动态创建导航点
                    for (let i = 0; i < len; i++) {
                        //创建span 标签
                        let span = document.createElement('span');
                        if (i === 0) {
                            span.className = 'active';
                        }
                        //插入到导航元素中
                        pagination.appendChild(span);
                    }

                    //获取导航点元素
                    dots = container.querySelectorAll('.swiper-pagination span');
                }
            }
            container.init();

            //自动播放
            container.autoRun = function () {
                if (!auto) return;
                //防止定时器重复
                clearInterval(timer);
                //启动定时器
                timer = setInterval(function () {
                    //索引自增 切换幻灯片
                    index++;
                    //增加过渡
                    wrapper.style.transition = 'all 0.5s';
                    container.switchSlide(index);
                    //index  9   index  4
                }, time);
            }
            container.autoRun();
            //获取轮播图的下标
            container.getIndex = function (){
                let left=transformCSS(wrapper,'translateX')
                return -(left/container.offsetWidth)

            }
            //切换幻灯片的功能   switchSlide(3)
            container.switchSlide = function (i, isTransition) {
                //如果没有传参  默认为过渡切换
                if (isTransition === undefined) {
                    isTransition = true;
                }

                if (isTransition) {
                    wrapper.style.transition = 'all 0.5s';
                } else {
                    wrapper.style.transition = 'none';
                }

                //计算新的left 的值
                let newLeft = -i * container.offsetWidth;
                //设置 left 的样式
                // wrapper.style.left = newLeft + 'px';
                // wrapper.style.transform = 'translateX('+newLeft+'px)';
                transformCSS(wrapper, 'translateX', newLeft);
                options && options.callback && typeof options.callback.end === 'function' && options.callback.end();
                //点的切换
                if (page) {
                    //移除所有导航点 active 类
                    dots.forEach(function (dot) {
                        // removeClass   addClass
                        dot.classList.remove('active');
                    });
                    //当前索引的导航点 增加 active 类  dots  4   i 5 6 7 8 9
                    dots[i % len].classList.add('active');
                }
                //设置当前的显示下标为 i
                index = i;
            }
            this.container=container
        }
        w.Swiper=Swiper
}
)(window)
