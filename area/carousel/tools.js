//自执行函数有内部作用域，需使用一个变量进行引用，否则会释放掉
var tools=(function(){
	
	function makeArray(likeArray){
		
		try{
			return Array.prototype.slice(likeArray,0);
		}catch(ex){
			var arr=[];
			for(var item in likeArray){
				arr.push(item);
			}
			return arr;
		}
	}
	
	function jsonParse(str){
		//jsonParse('{ "a":1,"b":2}')
		return 'JSON' in window ? JSON.parse(str):eval('('+ str +')');//别忘了eval内的括号
	}
	
	function win(attr,val){
		var _html=document.documentElement||document.body;
		if(typeof val!='undefined'){
			_html[attr]=val;
			return;
		}
		return _html[attr];
	}
	
	function getCss(ele,attr){
		var val=null;
		//标准形式
		if('getComputedStyle' in window){
			val=getComputedStyle(ele,null)[attr];
		}else{
			//ie 需处理opacity
			if(attr=='opacity'){
				val=ele.currentStyle['filter'];
				var filterReg=/^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
				//(\d+(?:\.\d+)?)表示有效小数 ?: 匹配不捕获
				//注意取得索引 1 <== filterReg.exec(val)["alpha(opacity=12.3)", "12.3"]
				val = filterReg.test(val)? filterReg.exec(val)[1]/100 : 1;
			}else{
				val=ele.currentStyle[attr];
			}
		}
		//进行数字转换 考虑到 opacity 也需转换，所以最后有一个问号
		var reg=/^-?\d+(\.\d+)?(px|pt|rem|em|deg)?$/;
		if(reg.test(val)){
			val=parseFloat(val);
		}
		return val;
	}
	
	function setCss(ele,attr,val){
		
		if(attr == 'opacity'){
			ele.style[attr]=val;
			ele.style.filter = 'alpha(opacity='+ val*100 +')';
			return;
		}else if(attr == 'float'){
			 //firefox,chorme,safari下对应的是cssFloat，IE下对应得是 styleFloat
			ele.style['cssFloat']=val;
			ele.style['styleFloat']=val;
			return;
		}
		//添加单位 
		var reg=/width|height|left|right|top|bottom|(padding|margin)(Left|Right|Top|Bottom)/;
		if(reg.test(attr)){
			if(typeof val =='number' && !isNaN(val))//值为有效数字的情况下
				val+='px';
		}
		ele.style[attr]=val;
		
	}
	
	//到body的距离值
	function offset(ele){
		var left=ele.offsetLeft;
		var top=ele.offsetTop;
		var parent=ele.offsetParent;//此处不能使用parentNode
		
		while(parent){
			
			left+=parent.offsetLeft+parent.clientLeft;
			top+=parent.clientTop+parent.clientTop;
			parent=parent.offsetParent;//此处不能使用parentNode
		}
		return {
			"left":left,
			"top":top
		}
		
	}
	//获取哥哥元素节点
	function prev(ele){
		//只代表一个之前的Node，不是所有的
		var pre=ele.previousSibling;
		
		while(pre&&pre.nodeType!=1){
			pre=pre.previousSibling;
		}
		return pre;
		
	}
	//获取所有哥哥元素节点
	function prevAll(ele){
		
		var pre=ele.previousSibling;
		var arr=[];
		while(pre){
			if(pre.nodeType==1)
				arr.push(pre);
			pre=pre.previousSibling;
		}
		return arr;
	}
	
	function index(ele){
		return prevAll(ele).length;
	}
	
	function next(ele){
		var next=ele.nextSibling;
		while(next&& next.nodeType!=1){
			next=next.nextSibling;
		}
		return next;
	}
	
	function nextAll(ele){
		var next=ele.nextSibling;
		var arr=[];
		while(next){
			if(next.nodeType==1){
				arr.push(next);
			}
			next=next.nextSibling;
		}
		return arr;
	}
	
	//var obj=document.getElementById('manipulation')
	//支持多个class
	function getElementsByClassName(strClassName,context){
		//处理参数
		context=context||document;
		//使用标准函数
		/*if('getElementsByClassName' in window){
			return context.getElementsByClassName(strClassName);
		}*/
		//兼容的
		var arr=[];
		//去除两头空格后,记得全局g，否则去除了开头，结尾不会去除 变成数组
		var classArray=strClassName.replace(/^\s+|\s+$/g,"").split(/\s+/);
		if(classArray.length==0) 
			return arr;
		var list=context.getElementsByTagName('*');
		for(var i=0;i<list.length;i++){
			var item =list[i];
			var flag=true;
			for(var j in classArray){
				var reg=new RegExp('\\b' + classArray[j] +'\\b'); //通过\b边界
				//var reg=new RegExp('(^|\\s+)' + classArray[j] +'(\\s+|$)'); //要么前面是空格要么是开头,不要忘记括号，作为一个整体使用
				
				if( !reg.test(item.className) ){
					
					flag=false;
					break;
				}
			}
			if(flag) arr.push(item);
		}
		return arr;
	}
	
	//只支持单个class
	function hasClass(ele,strClassName){
		var reg=new RegExp('(^|\\s+)'+strClassName+'(\\s+|$)');
		return reg.test(ele.className);
		
	}
	
	//支持多个class
	function addClass(ele,strClassName){
		var classArray=strClassName.replace(/^\s+|\s+$/g,"").split(/\s+/);
		if(strClassName.length==0) return;
		var newClassName=ele.className;
		for(var i=0;i<classArray.length;i++){
			var item=classArray[i];
			if(hasClass(ele,item)==false){
				newClassName+=' '+item;
			}
		}
		ele.className=newClassName;
	}
	
	//支持多个class
	function removeClass(ele,strClassName){
		var classArray=strClassName.replace(/^\s+|\s+$/g,"").split(/\s+/);
		if(strClassName.length==0) return;
		
		for(var i=0;i<classArray.length;i++){
			var item=classArray[i];
			var reg=new RegExp('(^|\\s+)'+ item +'(\\s+|$)','g');
			if(hasClass(ele,item)) {
				ele.className=ele.className.replace(reg,'');//不要忘记给ele.className赋值，有时会想当然认为replace返回了，但忘给ele.className赋值
			}

		}
	}
	
	
	/**补充*/
	
	function firstElementChild(ele){
		//使用children实现兼容
		return ele.children.length? ele.children[0]: null;
	}
	
	function lastElementChild(ele){
		return ele.children.length? ele.children[ele.children.length-1]: null;
	}
	
	/** ajax开始*/
	var ajax=function (method,url,data,callback){
		//处理参数
		if(typeof data=='object'){
			var arr=[];
			for(var key in data){
				//编码
				arr.push(encodeURI(key)+ '=' + encodeURI(data[key]) );
			}
			data=arr.join('&');
		}
		//处理url
		if(/^get|head|delete$/ig.test(method)){
			//如果是get系请求，拼接data到url上。
			//判断是否有问号
			url+= ( /\?/.test(url)? '&': '?' ) + data;
			data=null;
		}
		//1.
		var xhr=getXHR();
		//2.
		xhr.open(method,url,true);
		//2.1 如果支持自定义请求头部，把请求的MIMEType设置为表单提交
		xhr.setRequestHeader && xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		//3.
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if (/^2\d{2}$/.test(xhr.status))
					typeof(callback) =='function' && callback(ajax.Success,xhr.responseText);
				else
					//告知失败
					typeof(callback) =='function' && callback(ajax.Fail, xhr.status);
			}
		}
		//4.
		xhr.send(data)
	}
	
	ajax.Success=0;
	ajax.Fail=1;
	
	function getXHR(){
		var xhr=null;
		//使用懒惰函数
		var list=[function(){
			return new XMLHttpRequest();
		},function(){
			return new ActiveXObject('Microsoft.XMLHTTP');
		}];
		//依次取出
		while(xhr=list.shift()){
			try{
				xhr=xhr();
				break;
			}catch(ex){ //catch之后的括号不要忘
				xhr = null;
			}
		}
		/*
		try{
			xhr=new XMLHttpRequest();
		}catch{
			xhr=new ActiveXObject('Microsoft.XMLHTTP');
		}*/
		if(xhr==null){
			throw('xhr created fail!');
		}
		return xhr;
	}
	
	
	/** ajax结束*/
	
	/** 运动开始*/
	//target 目标对象
	//duration 持续时间
	//callback 回调
	function animate(ele,target,duration,callback){
		
		
		var tween=function(t,b,c,d){
			return b+t*c/d
		}
		//设置begin对象，change对象
		var begin={};
		var change={};
		for(var key in target){
			if(target.hasOwnProperty){//去除原型上的
				begin[key]=getCss(ele,key);
				change[key]=target[key]-begin[key];
			}
			
		}
		var time=0;
		var interval=10;
		//注意：每次调用之前都需要clear
		window.clearInterval(ele.timer);
		ele.timer=setInterval(function(){
			//累加时间
			time+=interval;
			if(time>=duration){
				window.clearInterval(ele.timer);
				for(var key in target){
					setCss(ele,key,target[key]);
				}
				typeof callback=='function' && callback();
			}else{
				for(var key in change){
					var b=begin[key];
					var c=change[key];
					var now =tween(time,b,c,duration);
					
					setCss(ele,key,now);
				}
			}
			
			
		},interval)
	}
	
	/** 运动结束*/
	
	return {
		
		makeArray:makeArray,
		jsonParse:jsonParse,
		win:win,
		getCss:getCss,
		setCss:setCss,
		offset:offset,
		prev:prev,
		prevAll:prevAll,
		index:index,
		next:nextAll,
		nextAll:nextAll,
		getElementsByClassName:getElementsByClassName,
		firstElementChild:firstElementChild,
		lastElementChild:lastElementChild,
		addClass:addClass,
		removeClass:removeClass,
		ajax:ajax,
		animate:animate
	}
})();


//轮播组件
;(function(){
	
	function Carousel(id){
		
		this.carousel=document.getElementById(id);
		this.imgListWrap=document.createElement('div'); //tools.getElementsByClassName('imgListWrap')[0];
		this.indicator=document.createElement('ul');//tools.getElementsByClassName('indicator')[0];
		this.leftBtn=document.createElement('a');
		this.rightBtn=document.createElement('a');
		this.imgBoxList=this.imgListWrap.getElementsByTagName('div');
		this.imgList=this.imgListWrap.getElementsByTagName('img');
		this.indicatorLis=this.indicator.getElementsByTagName('li');
		this.data=[];
		this.imgIndex=0;
		this.timer=null;
		
		this.fadeInterval=200;
		//切换间隔
		this.interval=1200;
		this.init();
	}
	
	Carousel.prototype={
		constructor:Carousel,
		//0.
		init:function(){
			var self=this;
			this.imgListWrap.className='imgListWrap';
			this.indicator.className='indicator';
			this.leftBtn.className='btn leftBtn';
			this.rightBtn.className='btn rightBtn';
			
			this.carousel.appendChild(this.imgListWrap);
			this.carousel.appendChild(this.indicator);
			this.carousel.appendChild(this.leftBtn);
			this.carousel.appendChild(this.rightBtn);
			
			
			this.getData();
			this.bindData();	
			this.lazyLoad(function(){
				//加载完图片后开始自动运行
				self.timer = window.setInterval(function(){
					self.autoRun(true);
				},self.interval)
			});
			this.setMouseEvent();
			this.setBtnEvent();
			this.setIndicatorEvent();

		},
		//1.获取数据
		getData:function(){
			this.data= [
				{"src":"images/swipe1.jpg","desc":"这是第1张图"},
				{"src":"images/swipe2.jpg","desc":"这是第2张图"},
				{"src":"images/swipe3.jpg","desc":"这是第3张图"},
				{"src":"images/swipe4.jpg","desc":"这是第4张图"}
			];
		},
		//2.
		bindData:function(){
			var imgListWrapStr='';
			var indicatorStr='';
			for(var i=0;i<this.data.length;i++){
				imgListWrapStr+='<div><img src="" data-src="'+this.data[i].src+'" alt="' + this.data[i].desc + '"></div>';
				indicatorStr+='<li></li>';
			}
			this.imgListWrap.innerHTML=imgListWrapStr;
			this.indicator.innerHTML=indicatorStr;
			
			//兼容IE，再次获取
			this.imgBoxList=this.imgListWrap.getElementsByTagName('div');
			this.imgList=this.imgListWrap.getElementsByTagName('img');
			this.indicatorLis=this.indicator.getElementsByTagName('li');					
		},
		//3.延迟加载图片
		lazyLoad:function(callback){
			var self=this;
			for(var i=0;i<this.imgList.length;i++){
				
				/*方案1 自定义属性
				var curImg=this.imgList[i];
				var _src=curImg.getAttribute('data-src');//如使用attributes[key]返回是一个对象，需取值 attributes[key].value
				var tempImg=new Image();
				tempImg.src=_src;
				//建议不要在file协议下测试onload事件，有时不会触发				
				tempImg.index=i;
				tempImg.onload=function(){
					
					self.imgList[this.index].src=this.src;
				}*/
				
				/*方案2 小闭包
				var curImg=this.imgList[i];
				var _src=curImg.getAttribute('data-src');//如使用attributes[key]返回是一个对象，需取值 attributes[key].value
				var tempImg=new Image();
				tempImg.src=_src;				
				tempImg.onload=(function(i,tempImg){
					self.imgList[i].src=tempImg.src;
				})(i,tempImg);*/
				
				/*方案3 大闭包*/
				;(function(i){
					var curImg=self.imgList[i];
					var _src=curImg.getAttribute('data-src');//如使用attributes[key]返回是一个对象，需取值 attributes[key].value
					var tempImg=new Image();
					//tempImg.src=_src;					
					tempImg.onload=function(){
						//如果是第一张
						if(i==0){
							tools.setCss(self.imgBoxList[i],'zIndex',1);
							tools.addClass(self.indicatorLis[i],'active');
						}else{
							tools.setCss(self.imgBoxList[i],'zIndex',0);
						}
						self.imgList[i].src=this.src;
					}
					//兼容IE，需要在onload之后设置src
					tempImg.src=_src;
				})(i);
			}
			
			typeof callback=='function' && callback();
		},
		//4.
		autoRun:function(next){
			if(next){
				this.imgIndex++;
				if(this.imgIndex == this.imgList.length)
					this.imgIndex = 0;				
			}
			else{
				this.imgIndex--;
				if(this.imgIndex <0)
					this.imgIndex = this.imgList.length-1;
			}
			this.tabNext();
		},
		//切换下一张
		tabNext:function(){
			var self=this;
			var curImg=this.imgList[this.imgIndex];
			var curImgBox=this.imgBoxList[this.imgIndex];
			
			tools.setCss(curImgBox,'zIndex',1);
			tools.setCss(curImg,'opacity',0);
			
			//运动开始前其他box 降级
			for(var i=0;i<self.imgBoxList.length;i++){
				if(i!=self.imgIndex)
					tools.setCss(self.imgBoxList[i],'zIndex',0);
			}			
			//运动
			tools.animate(curImg,{
				'opacity':1
				}, this.fadeInterval ,function(){
				//运动完成
				for(var i=0;i<self.imgList.length;i++){
					
					if(i!=self.imgIndex){
						tools.setCss(self.imgList[i],'opacity',0);
					}
				}
				//同步 indicator
				for(var i=0;i<self.imgList.length;i++){
					
					if(i!=self.imgIndex){
						tools.removeClass(self.indicatorLis[i],'active');
					}else{
						tools.addClass(self.indicatorLis[i],'active');
					}
				}				
			})
		},
		setMouseEvent:function(){
			var self=this;
			this.carousel.onmouseover=function(){
				window.clearInterval(self.timer);
				
				tools.setCss(self.leftBtn,'display','block');
				tools.setCss(self.rightBtn,'display','block');
			}
			this.carousel.onmouseout=function(){
				tools.setCss(self.leftBtn,'display','none');
				tools.setCss(self.rightBtn,'display','none');				
				self.timer=window.setInterval(function(){
					self.autoRun(true);
				},self.interval)
			}
		},
		setBtnEvent:function(){
			var self=this;
			this.leftBtn.onclick=function(){

				self.autoRun(false);
			}
			this.rightBtn.onclick=function(){
				self.autoRun(true);
			}
		},
		setIndicatorEvent:function(){
			var self=this;
			for(var i=0;i<this.indicatorLis.length;i++){
				this.indicatorLis[i].index=i;
				this.indicatorLis[i].onclick=function(){
					self.imgIndex=this.index;
					self.tabNext();
				}
			}			
		}
	}
	
	//自执行函数有内部作用域,将其挂载到window上，否则会释放掉??
	window.Carousel=Carousel;
})();


//经典轮播图
;(function (){
	function CarouselClassic(id){
		this.data=[];
		this.imgIndex=0;
		this.timer=null;
		this.interval=2000;
		this.fadeInterval=100;
		
		this.carousel=document.getElementById(id);
		this.imgListWrap=document.createElement('div');	
		this.indicator=document.createElement('ul');
		this.leftBtn=document.createElement('a');
		this.rightBtn=document.createElement('a');
		this.imgList=this.imgListWrap.getElementsByTagName('img');
		this.imgBoxList=this.imgListWrap.getElementsByTagName('div');
		this.indicatorLis=this.indicator.getElementsByTagName('li');
		
		this.init();
	}
	
	CarouselClassic.prototype={
		constructor:CarouselClassic,
		init:function(){
			var self=this;
			this.imgListWrap.className='imgListWrap';
			this.indicator.className='indicator';
			this.leftBtn.className='btn leftBtn';
			this.rightBtn.className='btn rightBtn';
			//添加元素
			this.carousel.appendChild(this.imgListWrap);
			this.carousel.appendChild(this.indicator);
			this.carousel.appendChild(this.leftBtn);
			this.carousel.appendChild(this.rightBtn);
			//调用方法
			this.getData();
			this.bindData();
			this.lazyLoad(function(){
				
				self.timer=window.setInterval(function(){
					self.autoRun(true);
				},self.interval);/**/
			});
			
			this.setMouseEvent();
			this.setBtnEvent();
			this.setIndicatorEvent();
			
		},
		getData:function(){
			//无缝切换，返回两倍的数据
			this.data=
				[				
				{"src":"images/swipe1.jpg","desc":"这是第1张图"},
				{"src":"images/swipe2.jpg","desc":"这是第2张图"},
				{"src":"images/swipe3.jpg","desc":"这是第3张图"},
				{"src":"images/swipe4.jpg","desc":"这是第4张图"},
				{"src":"images/swipe1.jpg","desc":"这是第1张图"},
				{"src":"images/swipe2.jpg","desc":"这是第2张图"},
				{"src":"images/swipe3.jpg","desc":"这是第3张图"},
				{"src":"images/swipe4.jpg","desc":"这是第4张图"}];
		},
		bindData:function(){
			
			var imgListWrapStr='';
			var indicatorStr='';
			
			for(var i=0;i<this.data.length;i++){
				imgListWrapStr +='<div><img src="" data-src="'+ this.data[i].src +'" alt="'+ this.data[i].desc +'"></div>';
				
			}
			//*li 只需要一半
			for(var i=0;i<this.data.length/2 ;i++){
				
				indicatorStr +='<li></li>';
			}
			this.imgListWrap.innerHTML=imgListWrapStr;
			this.indicator.innerHTML=indicatorStr;
			
			//兼容IE，再次获取
			this.imgBoxList=this.imgListWrap.getElementsByTagName('div');
			this.imgList=this.imgListWrap.getElementsByTagName('img');
			this.indicatorLis=this.indicator.getElementsByTagName('li');
			
			// *根据图片数量 设置宽度
			tools.setCss(this.imgListWrap,'width',this.imgList.length*100+'%');
		},
		lazyLoad:function(callback){
			var self=this;
			for(var i=0;i<this.imgList.length;i++){
				var _src=this.imgList[i].getAttribute('data-src');
				var tempImg=new Image();
				//tempImg.src=_src;
				tempImg.index=i;
				tempImg.onload=function(){
					
					self.imgList[this.index].src=this.src;
					
					tempImg=null;
					//* 第一张图片
					if(this.index==0){
						tools.addClass(self.indicatorLis[0],'active');
					}
				} 
				//兼容IE，需要在onload之后设置src
				tempImg.src=_src;				
			}
			typeof callback =='function' && callback();
			
		},
		tabNext:function(){
			var self=this;
			var imgWidth=this.imgList[0].clientWidth;
			var target= -imgWidth * this.imgIndex;
						
			tools.animate(this.imgListWrap,{
				'left':target
			},this.fadeInterval,function(){
				//* 同步 indicator
				
				var newIndex=self.imgIndex%(self.imgList.length/2);
				for(var i=0;i< self.indicatorLis.length;i++){
					if(i==newIndex){
						tools.addClass(self.indicatorLis[i],'active');
						
					}else{
						tools.removeClass(self.indicatorLis[i],'active');
					}
				}
			});
		},
		autoRun:function(next){
			//* 调整
			var imgWidth=this.imgList[0].clientWidth;
			if(this.imgIndex == 0 ){
				this.imgIndex = this.data.length/2;
				tools.setCss(this.imgListWrap,'left',this.imgIndex * -imgWidth);
			}else if(this.imgIndex == this.data.length-1 ){
				this.imgIndex = this.data.length/2-1;
				tools.setCss(this.imgListWrap,'left',this.imgIndex * -imgWidth);
			}
			if(next){
				this.imgIndex++;
			}else{
				this.imgIndex--;
			}
			this.tabNext();
		},
		setMouseEvent:function(){
			var self=this;
			this.carousel.onmouseover=function(){
				
				window.clearInterval(self.timer);
				tools.setCss(self.leftBtn,'display','block');
				tools.setCss(self.rightBtn,'display','block');

			}
			this.carousel.onmouseout=function(){
				tools.setCss(self.leftBtn,'display','none');
				tools.setCss(self.rightBtn,'display','none');	
				self.timer=window.setInterval(function(){
					self.autoRun(true);
				},self.interval);/**/		
			}
			
		},
		setBtnEvent:function(){
			var self=this;
			this.leftBtn.onclick=function(){
				self.autoRun(false);
			}
			this.rightBtn.onclick=function(){
				self.autoRun(true);
			}
		},
		setIndicatorEvent:function(){
			var self=this;
			for(var i=0;i<this.indicatorLis.length;i++){
				this.indicatorLis[i].index=i;
				this.indicatorLis[i].onclick=function(){
					self.imgIndex=this.index;
					self.tabNext();
				}
			}
		}
	}
	
	window.CarouselClassic=CarouselClassic;
})();


//经典轮播图2
;(function (){
	function CarouselClassic2(id){
		this.data=[];
		this.imgIndex=0;
		this.timer=null;
		this.interval=2000;
		this.fadeInterval=300;
		
		this.carousel=document.getElementById(id);
		this.imgListWrap=document.createElement('div');	
		this.indicator=document.createElement('ul');
		this.leftBtn=document.createElement('a');
		this.rightBtn=document.createElement('a');
		this.imgList=this.imgListWrap.getElementsByTagName('img');
		this.imgBoxList=this.imgListWrap.getElementsByTagName('div');
		this.indicatorLis=this.indicator.getElementsByTagName('li');
		
		this.init();
	}
	
	CarouselClassic2.prototype={
		constructor:CarouselClassic,
		init:function(){
			var self=this;
			this.imgListWrap.className='imgListWrap';
			this.indicator.className='indicator';
			this.leftBtn.className='btn leftBtn';
			this.rightBtn.className='btn rightBtn';
			//添加元素
			this.carousel.appendChild(this.imgListWrap);
			this.carousel.appendChild(this.indicator);
			this.carousel.appendChild(this.leftBtn);
			this.carousel.appendChild(this.rightBtn);
			//调用方法
			this.getData();
			this.bindData();
			this.lazyLoad(function(){
				
				self.timer=window.setInterval(function(){
					self.autoRun(true);
				},self.interval);/**/
			});
			
			this.setMouseEvent();
			this.setBtnEvent();
			this.setIndicatorEvent();
			
		},
		getData:function(){
			
			this.data=
				[				
				{"src":"images/swipe1.jpg","desc":"这是第1张图"},
				{"src":"images/swipe2.jpg","desc":"这是第2张图"},
				{"src":"images/swipe3.jpg","desc":"这是第3张图"},
				{"src":"images/swipe4.jpg","desc":"这是第4张图"}];
		},
		bindData:function(){
			
			var imgListWrapStr='';
			var indicatorStr='';
			
			for(var i=0;i<this.data.length;i++){
				imgListWrapStr +='<div><img src="" data-src="'+ this.data[i].src +'" alt="'+ this.data[i].desc +'"></div>';
				
			}
			////无缝切换 还需要添加一个
			imgListWrapStr +='<div><img src="" data-src="'+ this.data[0].src +'" alt="'+ this.data[0].desc +'"></div>';
			//*li
			for(var i=0;i<this.data.length ;i++){
				
				indicatorStr +='<li></li>';
			}
			this.imgListWrap.innerHTML=imgListWrapStr;
			this.indicator.innerHTML=indicatorStr;
			
			//兼容IE，再次获取
			this.imgBoxList=this.imgListWrap.getElementsByTagName('div');
			this.imgList=this.imgListWrap.getElementsByTagName('img');
			this.indicatorLis=this.indicator.getElementsByTagName('li');		
			
			// *根据图片数量 设置宽度
			tools.setCss(this.imgListWrap,'width',this.imgList.length*100+'%');
		},
		lazyLoad:function(callback){
			var self=this;
			for(var i=0;i<this.imgList.length;i++){
				var _src=this.imgList[i].getAttribute('data-src');
				var tempImg=new Image();
				//tempImg.src=_src;
				tempImg.index=i;
				tempImg.onload=function(){
					
					self.imgList[this.index].src=this.src;
					
					//* 第一张图片
					if(this.index==0){
						tools.addClass(self.indicatorLis[0],'active');
					}
					
				}
				//兼容IE，需要在onload之后设置src
				tempImg.src=_src;
			}
			typeof callback =='function' && callback();
			
		},
		tabNext:function(){
			var self=this;
			var imgWidth=this.imgList[0].clientWidth;
			var target= -imgWidth * this.imgIndex;
						
			tools.animate(this.imgListWrap,{
				'left':target
			},this.fadeInterval,function(){
				//* 同步 indicator
				var newIndex=self.imgIndex%(self.indicatorLis.length);
				for(var i=0;i< self.indicatorLis.length;i++){
					if(i==newIndex){
						tools.addClass(self.indicatorLis[i],'active');
						
					}else{
						tools.removeClass(self.indicatorLis[i],'active');
					}
				}
			});
		},
		autoRun:function(next){
			//* 调整
			var imgWidth=this.imgList[0].clientWidth;

			//只有在第一张图片且往下操作的时候才需要调整
			if(this.imgIndex == 0 && next ==false){
				this.imgIndex = this.data.length;
				//注意：this.imgList.length比this.data.length 多一个
				tools.setCss(this.imgListWrap,'left',this.imgIndex * -imgWidth);
			}else if(this.imgIndex == this.data.length && next ==true ){
				this.imgIndex = 0;
				tools.setCss(this.imgListWrap,'left',0 * -imgWidth);
			}
			if(next){
				this.imgIndex++;
			}else{
				this.imgIndex--;
			}
			this.tabNext();
		},
		setMouseEvent:function(){
			var self=this;
			this.carousel.onmouseover=function(){
				
				window.clearInterval(self.timer);
				tools.setCss(self.leftBtn,'display','block');
				tools.setCss(self.rightBtn,'display','block');

			}
			this.carousel.onmouseout=function(){
				tools.setCss(self.leftBtn,'display','none');
				tools.setCss(self.rightBtn,'display','none');	
				self.timer=window.setInterval(function(){
					self.autoRun(true);
				},self.interval);/**/		
			}
			
		},
		setBtnEvent:function(){
			var self=this;
			this.leftBtn.onclick=function(){
				self.autoRun(false);
			}
			this.rightBtn.onclick=function(){
				self.autoRun(true);
			}
		},
		setIndicatorEvent:function(){
			var self=this;
			for(var i=0;i<this.indicatorLis.length;i++){
				this.indicatorLis[i].index=i;
				this.indicatorLis[i].onclick=function(){
					self.imgIndex=this.index;
					self.tabNext();
				}
			}
		}
	}
	
	window.CarouselClassic2=CarouselClassic2;
})();