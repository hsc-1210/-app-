(function (w) {

    function transformCSS(el, prop, val) {
        //初始化样式仓库
        if (el.store === undefined) {
            el.store = {};
        }
        //设置
        if (arguments.length === 3) {
            el.style.transform = prop + '(' + val + 'px)';
            el.store[prop] = val;
            let str = '';
            for (let i in el.store) {
                switch (i) {
                    case 'translateX':
                    case 'translateY':
                    case 'translateZ':
                        str += i + '(' + el.store[i] + 'px) ';
                        break;
                    case 'rotate':
                    case 'rotateX':
                    case 'rotateY':
                    case 'rotateZ':
                        str += i + '(' + el.store[i] + 'deg) ';
                        break;

                    case 'scale':
                    case 'scaleX':
                    case 'scaleY':
                    case 'scaleZ':
                        str += i + '(' + el.store[i] + ') ';
                        break;
                }
                //设置变形样式
                el.style.transform = str;
            }
        }

        //样式读取
        if (arguments.length === 2) {
            //判断 如果设置了 则返回设置的值
            if (el.store[prop]) {
                return el.store[prop];
            }
            let start = prop.substr(0, 5);
            if (start === 'scale') {
                return 1;
            } else {
                return 0;
            }
        }
    }

    w.transformCSS = transformCSS;

})(window);




