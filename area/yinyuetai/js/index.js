window.onload=function(){

    document.addEventListener('touchstart',function(ev){

        ev.preventDefault();
    })

    document.addEventListener('touchmove',function(ev){

        ev.preventDefault();
    })

     document.addEventListener('touchend',function(ev){

        ev.preventDefault();
    })   



    /*****滚动条 */
    //三大块，wrap content bar
    var scrollWrap=document.getElementById('content_wrap');
    var content=document.getElementById('content');
    //滚动条
    var scrollBar=document.getElementById('scrollBar');

    var searchForm=document.getElementById('searchForm');

    var scale=scrollWrap.clientHeight/content.offsetHeight;
    var scrollCallBack={
        start:function(){
            scrollBar.style.transition='none';
            scrollBar.style.opacity=1;
            scrollBar.style.height=scale*scrollWrap.clientHeight+'px';
            
        },
        move:function(){
            //计算滚动条位置
            var contentY=cssTransform(content,"translateY");
            var _s=contentY/content.offsetHeight;
            var val=-scrollWrap.clientHeight*_s;
            cssTransform(scrollBar,"translateY",val);

        },
        end:function(){
            scrollBar.style.transition='1s';
            scrollBar.style.opacity=0;
        }
    }

    
    mScroll(scrollWrap,content,scrollCallBack);

    function mScroll(scrollWrap,content,scrollCallBack){
        var startPoint={};
        var isFirst=false;
        var isMove=true;
        //初始 translateY
        var startY;
        //用于完成动画的变量
        var lastPoint={};
        var lastTime=0;
        var lastTimeDis=0;
        var lastPointDis=0;
        //3d
        cssTransform(content,"translateZ",0.01);
        //需要注意的是：因为是减去content.offsetHeight 所以需要把padding加在content上，否则offsetHeight就不对了
        //初始获取不准确
        var min=0;
        
        scrollWrap.addEventListener('touchstart',function(e){
            clearInterval(content.timer);
            startPoint={
                pageX:e.changedTouches[0].pageX,
                pageY:e.changedTouches[0].pageY
            }
            
            startY=cssTransform(content,'translateY');
            isFirst=true;
            isMove=true;
            typeof scrollCallBack.start =='function' && scrollCallBack.start();
        })
        scrollWrap.addEventListener('touchmove',function(e){
            
            //防抖 判断
            if(isMove==false){
                return;
            }
            
            var nowPoint={
                pageX:e.changedTouches[0].pageX,
                pageY:e.changedTouches[0].pageY
            }
            
            var nowTime=new Date().getTime();

            //两点距离disX,disY相比较 
            var disX=nowPoint.pageX-startPoint.pageX;
            var disY=nowPoint.pageY-startPoint.pageY;

            lastTimeDis=nowTime-lastTime;
            lastPointDis=nowPoint.pageY-lastPoint.pageY;

            lastTime=nowTime;
            lastPoint=nowPoint;
            //防抖
            if(isFirst){
                isFirst=false;
                if( Math.abs(disX)> Math.abs(disY) ){
                    isMove=false;
                    return;
                }
            }
            
            var nowY=startY+disY;
            
            cssTransform(content,'translateY',nowY);
            typeof scrollCallBack.move =='function' && scrollCallBack.move();
            e.preventDefault();
        })
        
        scrollWrap.addEventListener('touchend',function(e){

            min=scrollWrap.clientHeight- content.offsetHeight;

            //滚动条 缓冲速度
            var speed=lastPointDis/lastTimeDis;
            speed= isNaN(speed)? 0 :speed;
            //放大速度系数
            speed=speed*100;
            var targetValue=cssTransform(content,'translateY') +speed;
            log(lastPoint.pageY,speed,e,content,'speed');
            var tweenType='easeOut';
            //在touchmove考虑的和touchend考虑的不一样
            if(targetValue>0){
                targetValue=0;
                tweenType='backOut';
            }else if(targetValue<min){
                targetValue=min;
                tweenType='backOut';
            }
            moveTween(content,'translateY',targetValue,tweenType,scrollCallBack);
            //回调在moveTween里面完成
            //typeof scrollCallBack.end =='function' && scrollCallBack.end();
        })

    }

    //obj 对象,transform ,targetValue 目标值,tweenType
    function moveTween(obj,transformType,targetValue,tweenType,scrollCallBack){
        //t 当前的次数 b 起始值 c差值 d总次数
        var t=0;
        var b=cssTransform(obj,transformType);
        var c=targetValue-b;
        var d=Math.abs( Math.round(c/20) ) ;
        var Tween = {
            easeOut: function(t, b, c, d){
                return -c * ((t=t/d-1)*t*t*t - 1) + b;
            },
            backOut: function(t, b, c, d, s){
                if (typeof s == 'undefined') {
                    s = 1.70158;  
                }
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            } 
        };
        //log(t,b,c,d, 'NOvalue');
        clearInterval(obj.timer);
        obj.timer=setInterval(
            function(){
                t++;
                if(t>d){
                    clearInterval(obj.timer);
                    typeof scrollCallBack.end =='function' && scrollCallBack.end();
                }else{
                    var value=Tween[tweenType](t,b,c,d);
                    cssTransform(obj,transformType,value);
                    //log(t,b,c,d, value);
                    typeof scrollCallBack.move =='function' && scrollCallBack.move();
                }
        },20);
    }

    /*****轮播图 */
    var swipeWrap=document.getElementById('swipe_wrap');
    var swipeList=swipeWrap.querySelector('.swipe_list');
    swipe(swipeWrap,swipeList);
    function swipe(swipeWrap,swipeList){

        var startPoint={};
        var startX=0;
        var isFirst=true;
        var isMove=true;
        var onePicWdith=swipeList.children[0].getBoundingClientRect().width;
        var nowIndex=0;
        var indicators=document.querySelectorAll('.swipe_indicator li');

        //选中轮播下方圆点
        function selectIndicator(newI){
            
            for (var i = 0; i < indicators.length; i++) {
                indicators[i].className='';
            }
            indicators[newI].className='selected';
        }

        cssTransform(swipeList,'translateZ',0.01);
        swipeWrap.addEventListener('touchstart',function(e){

            e.preventDefault();
            //e.stopPropagation();
            //清除定时器
            clearInterval(swipeList.timer);
            swipeList.style.transition='none';
            isFirst=true;
            isMove=true;
            startPoint={
                pageX:e.changedTouches[0].pageX,
                pageY:e.changedTouches[0].pageY
            }
            
            //在开始之前调整nowIndex
            if(nowIndex==0){
                nowIndex=5;
                cssTransform(swipeList,"translateX",-nowIndex * onePicWdith);
            }else if(nowIndex==9){
                nowIndex=4;
                cssTransform(swipeList,"translateX",-nowIndex * onePicWdith);
            }
            startX=cssTransform(swipeList,'translateX');
            
        })
        swipeWrap.addEventListener('touchmove',function(e){

            e.preventDefault();
            //e.stopPropagation();

            if(isMove==false){
                
                return;
            }
            
            var nowPoint={
                pageX:e.changedTouches[0].pageX,
                pageY:e.changedTouches[0].pageY
            }
            var disX=nowPoint.pageX-startPoint.pageX;
            var disY=nowPoint.pageY-startPoint.pageY;

            
            if(isFirst){
                isFirst=false;
                //水平移动
                if(Math.abs(disY) > Math.abs(disX)){
                    isMove=false;
                    return;
                    
                }
            }
            
            var nowX=startX+disX;
            cssTransform(swipeList,'translateX',nowX);
            
        })
        swipeWrap.addEventListener('touchend',function(e){
            
            e.preventDefault();
            //e.stopPropagation();
            
            var nowX=cssTransform(swipeList,'translateX');
            //使用Math.round和nowIndex来判断移动后是第几张
            nowIndex= - Math.round(nowX/swipeWrap.offsetWidth);
            
            var targetX=-nowIndex*swipeWrap.offsetWidth;
            cssTransform(swipeList,'translateX',targetX);
            selectIndicator(nowIndex%5);
            swipeList.style.transition='.5s';
            
            auto();
        })

        auto();
        //自动播放
        function auto(){

            clearInterval(swipeList.timer);
            swipeList.timer=setInterval(function(){
				
				//每次timer调用再获取一次，初始获取不准确
				onePicWdith=swipeList.children[0].offsetWidth;
				//print(onePicWdith,swipeList.children[0].clientWidth,'test')
				
                swipeList.style.transition='none';
                if(nowIndex==0){
                    nowIndex=5;
                    cssTransform(swipeList,"translateX",-nowIndex * onePicWdith);
                }else if(nowIndex==9){
                    nowIndex=4;
                    cssTransform(swipeList,"translateX",-nowIndex * onePicWdith);
                }

                //阻止dom过快执行
                setTimeout(function() {
                    nowIndex++;
                    swipeList.style.transition='.5s';
                    selectIndicator(nowIndex%5);
                    
                    cssTransform(swipeList,"translateX",-nowIndex * onePicWdith);                   
                }, 20);


            },1200);
        }
    }
    
    /*****内容区域滑动 */
    var contentListWrap=document.querySelectorAll('#section_mvshoubo.content_innerbox');
    var contentLoading=document.querySelectorAll('#section_mvshoubo .content_loading');
    contentListTab(contentListWrap[0],contentLoading[0]);

    
    function contentListTab(content_innerbox,contentLoading){
        
        var contentListWrap=getByClassName('content_listWrap',content_innerbox)[0];
        var contentList=getByClassName('content_list',content_innerbox)[0];
        var startPoint={};
        var startX=0;
        var isFirst=true;
        var isMove=true;
        var oneTabWdith=contentListWrap.offsetWidth;
        var nowIndex=0;
        var tab=getByClassName('content_tab',content_innerbox)[0]; 
        var tabLis=getByTagName('li',tab);
        //切换
        var isSwitch=false;

        cssTransform(contentList,'translateZ',0.01);
        contentListWrap.addEventListener('touchstart',function(e){

            isFirst=true;
            isMove=true;
            isSwitch=false;
            startPoint={
                pageX:e.changedTouches[0].pageX,
                pageY:e.changedTouches[0].pageY
            }
            
            startX=cssTransform(contentList,'translateX');
            
            
        })
        contentListWrap.addEventListener('touchmove',function(e){


            if(isMove==false){
                
                return;
            }
            
            var nowPoint={
                pageX:e.changedTouches[0].pageX,
                pageY:e.changedTouches[0].pageY
            }
            var disX=nowPoint.pageX-startPoint.pageX;
            var disY=nowPoint.pageY-startPoint.pageY;

            
            if(isFirst){
                isFirst=false;
                //水平移动
                if(Math.abs(disY) > Math.abs(disX)){
                    
                    isMove=false;
                    return;
                    
                }
            }
            
            var nowX=startX+disX;
            cssTransform(contentList,'translateX',nowX);
            //如果超出一半宽度
            if(Math.abs(disX) > oneTabWdith*0.5){
                contentList.style.display='none';
                contentLoading.style.display='block';
                isSwitch=true;
            }
        })
        contentListWrap.addEventListener('touchend',function(e){

            if(isSwitch){
                var nowX=cssTransform(contentList,'translateX');
                var disX=nowX-startX;
                //右侧
                if(disX>0){
                    nowIndex--
                }else{
                    nowIndex++;
                }
                if(nowIndex>=tabLis.length){
                    nowIndex=0;
                }else if (nowIndex<0){
                    nowIndex=tabLis.length-1;
                }
                for (var i = 0; i < tabLis.length; i++) {
                    tabLis[i].className='';
                }
                tabLis[nowIndex].className='selected';
                //模拟xhr
                setTimeout(function() {
                    contentList.style.display='block';
                    contentLoading.style.display='none';
                    cssTransform(contentList,'translateX',0);           
                }, 1000);
            }else{
                contentList.style.transition='.5s';
                cssTransform(contentList,'translateX',0);
            }
        })
    }

    /*****navScroll */
    var navScrollWrap=document.getElementById('navScroll_wrap');
    var navScroll=document.getElementById('navScroll');  

    
    var totalWidth=0;
    for (var j = 0; j < navScroll.children.length; j++) {
        var element = navScroll.children[j];
        totalWidth+=element.offsetWidth;
    }
    navScroll.style.width=totalWidth+'px';
    navScrollMove(navScrollWrap,navScroll);
    function navScrollMove(scrollWrap,content){

        var startPoint={};
        var isFirst=false;
        var isMove=true;
        //初始 translateX
        var startX;
        //用于完成动画的变量
        var lastPoint={};
        var lastTime=0;
        var lastTimeDis=0;
        var lastPointDis=0;
        //3d
        cssTransform(content,"translateZ",0.01);

        var min=scrollWrap.clientWidth- navScroll.offsetWidth;
        
        scrollWrap.addEventListener('touchstart',function(e){
            e.preventDefault();
            e.stopPropagation();

            content.style.transition='none';
            startPoint={
                pageX:e.changedTouches[0].pageX,
                pageY:e.changedTouches[0].pageY
            }
            
            startX=cssTransform(content,'translateX');
            isFirst=true;
            isMove=true;

        })
        scrollWrap.addEventListener('touchmove',function(e){
            e.preventDefault();
            e.stopPropagation();            
            //防抖 判断
            if(isMove==false){
                return;
            }
            
            var nowPoint={
                pageX:e.changedTouches[0].pageX,
                pageY:e.changedTouches[0].pageY
            }
            
            var nowTime=new Date().getTime();

            //两点距离disX,disY相比较 
            var disX=nowPoint.pageX-startPoint.pageX;
            var disY=nowPoint.pageY-startPoint.pageY;

            lastTimeDis=nowTime-lastTime;
            lastPointDis=nowPoint.pageX-lastPoint.pageX;
            
            lastTime=nowTime;
            lastPoint=nowPoint;
            //防抖
            if(isFirst){
                isFirst=false;
                if( Math.abs(disY)> Math.abs(disX) ){
                    isMove=false;
                    return;
                }
            }
            
            var nowX=startX+disX;
            cssTransform(content,'translateX',nowX);
            
        })
        
        scrollWrap.addEventListener('touchend',function(e){
            e.preventDefault();
            e.stopPropagation();            
            
            //缓冲速度
            var speed=lastPointDis/lastTimeDis;
            speed= isNaN(speed)? 0 :speed;
            var targetValue=cssTransform(content,'translateX') +speed;
            
            if(targetValue>0){
                targetValue=0;
                
            }else if(targetValue<min){
                targetValue=min;
                
            }
            content.style.transition='0.5s';
            content.style.transitionTimingFunction='cubic-bezier(0.1, 0.57, 0.1, 1)';

            cssTransform(content,'translateX',targetValue);
            
        })

    }

    /*****menuBtn */

    var menuBtn=document.getElementById('menuBtn');
    var navMenu=document.getElementById('navMenu');
    
    menuBtn.addEventListener('touchstart',function(e){
        if(this.className=='show'){
            this.className='';
            navMenu.style.display='none';
        }else{
            this.className='show';
            navMenu.style.display='block';
        }

    })
}


function log(){
    console.log(arguments);
}

function print(){
    var input=document.querySelector('.search input[type="text"]');
    var val='';
    for (var i = 0; i < arguments.length; i++) {
        val+=' '+arguments[i];
    }
    input.value=val;
}

function getByTagName(tagName,parent){
    var arr=parent.getElementsByTagName(tagName);
    return arr;
    
}

function getByClassName(className,parent){
    var arr=parent.getElementsByTagName('*');
    var result=[];
    for (var index = 0; index < arr.length; index++) {
        
        var element = arr[index];
        var classNameArr=element.className.split(' ');
        var findIndex=classNameArr.indexOf(className);
        
        if(findIndex!=-1){
            result.push(element);
        }
    }
    return result;
}

function cssTransform(el,attr,val) {
    if(!el.transform){
        el.transform={};
    }
    if(typeof val !='undefined'){
        el.transform[attr]=val;

        var cssStr='';
        for (var key in el.transform) {
            switch(key){
                case 'rotate':
                case 'skewX':
                case 'skewY':
                    cssStr+=key+'('+el.transform[key]+'deg)';
                    break;
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    cssStr+=key+'('+el.transform[key]+'px)';
                    break;
                case 'scaleX':
                case 'scaleY':
                case 'scale':
                    cssStr+=key+'('+el.transform[key]+')';
                    break;
            }
            el.style.transform=el.style.WebkitTransform=cssStr;
        }
    }else{
        var value=el.transform[attr];
        if(typeof value =='undefined'){
            if(attr.indexOf('scale')>-1){
                value=1;
            }else{
                value=0;
            }
        }
        return value;
    }
}