

(function () {
	
	//动态调整内容区域高度
	function changeHeight() {
		var header=tools.$('.header')[0];
		var weiyunContent=tools.$('.weiyun-content')[0];

		var h=document.documentElement.clientHeight-header.offsetHeight;
		weiyunContent.style.height=h+'px';
	}
	changeHeight();
	window.onresize=changeHeight;


	var allFileCollection=data.files;

	//文件列表
	var oFileList=tools.$('.file-list')[0];
	oFileList.innerHTML=createFileHtml(allFileCollection,0);

	//tree
	var oTreeMenu=tools.$('.tree-menu')[0];
	//传入-1是为了 显示“微云”这个root
	oTreeMenu.innerHTML=createTreeNodeHtml(allFileCollection,-1);
	//选中第一个子项
	tools.addClass(tools.$('.tree-title')[0],'tree-nav');

	//path nav
	var oPathNav=tools.$('.path-nav')[0];
	oPathNav.innerHTML=createPathNavHtml(allFileCollection,0);

	var oEmpty=tools.$('.g-empty')[0];
	var oSelectAll=tools.$('.checked-all')[0];
	var oCreate=tools.$('.create')[0];
	var isCreateNewFile=false;
	var currentFileId=0;

	//tree click deleage

	tools.addEvent(oTreeMenu,'click',function(ev){
		//不要混淆tools.parents[获取dom的层级关系] 和 dataControl.getParents[获取json数据的层级关系]
		//获取真正需要的target
		var target=tools.parents(ev.target,'.tree-title');
		if(target){
			//dataset
			//获取
			var id=target.dataset.fileId;

			reLoad(id);
		}
	})

	//filelist click deleage
	tools.addEvent(oFileList,'click',function(ev){
		//获取真正需要的target
		var target=tools.parents(ev.target,'.item');

		if(target){
			//dataset
			//获取
			var id=target.dataset.fileId;

			reLoad(id);
		}
	})
	//pathnav click deleage
	tools.addEvent(oPathNav,'click',function(ev){
		var target=ev.target;
		if(target.tagName.toUpperCase()=='A'){
			var id=target.dataset.fileId;
			reLoad(id);
		}
		
	})

	//文件项 鼠标移入，点击
	//..此处each与forEach不同
	//forEach只能针对数组
	var oFileItem=tools.$('.file-item');
	tools.each(oFileItem,function(item,index){
		fileSelectHandle(item);
	})

	//全选点击
	tools.addEvent(oSelectAll,'click',function(){
		var result=tools.toggleClass(oSelectAll,'checked');
		if(result){
			tools.each(oFileItem,function(item,index){
				var checkbox=tools.$('.checkbox',item)[0];
				tools.addClass(item,'file-checked');
				tools.addClass(checkbox,'checked');				
			})
		}else{
			tools.each(oFileItem,function(item,index){
				var checkbox=tools.$('.checkbox',item)[0];
				tools.removeClass(item,'file-checked');
				tools.removeClass(checkbox,'checked');				
			})
		}
	})

	
	tools.addEvent(oCreate,'mouseup',function(){
		
		//原来没有子文件，现在创建子文件之后隐藏提示
		//需要在添加元素前设置隐藏，没有子元素的情况下，在添加元素后隐藏会导致布局错位。
		if(oEmpty.style.display!='none'){
			oEmpty.style.display='none';
		}

		var fileData={
			id:new Date().getTime(),
			title:''
		}
		//这边只是创建一个空文件，在body上mousedown的时候完成创建
		var newElement=createSingleFileElement(fileData);
		oFileList.insertBefore(newElement,oFileList.firstElementChild);
		
		isCreateNewFile=true;
		var oFileTitle=tools.$('.file-title',newElement)[0];
		var oFileEdtor=tools.$('.file-edtor',newElement)[0];
		var oEdtor=tools.$('.edtor',newElement)[0];
		oFileTitle.style.display='none';
		oFileEdtor.style.display='block';
		oEdtor.focus();

	})
	//完成新建
	tools.addEvent(document.body,'mousedown',function (ev) {
		if(isCreateNewFile){
			isCreateNewFile=false;

			var newElement=oFileList.firstElementChild;
			var oEdtor=tools.$('.edtor',newElement)[0];
			var value=oEdtor.value;
			//如果为空
			if(value.trim()==''){
				oFileList.removeChild(newElement);
				return;
			}
			var fid=tools.$('.item',newElement)[0].dataset.fileId;
			var oFileTitle=tools.$('.file-title',newElement)[0];
			var oFileEdtor=tools.$('.file-edtor',newElement)[0];
			
			
			
			oFileTitle.style.display='block';
			oFileEdtor.style.display='none';
			oFileTitle.innerText=value;

			var fileData={
				id:fid,
				title:value,
				pid:currentFileId
			}

			//add to json
			allFileCollection.push(fileData);

			//add to tree
			var parentTreeNode=oTreeMenu.querySelector('.tree-title[data-file-id="'+currentFileId+'"]');
			var level = dataControl.getLevelById(allFileCollection,fid);
			var newTreeNode=createSingleTreeNodeElement(fileData,level);
			//在parentNode-li上添加新元素
			parentTreeNode.parentNode.appendChild(newTreeNode);
			//父级添加css
			tools.removeClass(parentTreeNode,'tree-contro-none');
			tools.addClass(parentTreeNode,'tree-contro');

			//bind 
			fileSelectHandle(newElement);

			//成功之后显示信息
			showTips('文件夹新建成功','ok');
		}
	})	

	var dragDiv=null;

	var originX=0;
	var originY=0;
	//框选功能
	tools.addEvent(document,'mousedown',function (ev) {

		originX=ev.clientX;
		originY=ev.clientY;

		if(!dragDiv){
			dragDiv=document.createElement('div');
			dragDiv.className='selectTab';
			document.body.appendChild(dragDiv);
		}

		tools.addEvent(document,'mousemove',mousemove);

		tools.addEvent(document,'mouseup',mouseup);
	})

	function mousemove(ev){
		//去除浏览器的默认行为，防止默认选中
		ev.preventDefault();

		var w=Math.abs(ev.clientX-originX);
		var h=Math.abs(ev.clientY-originY) ;
		
		if(w>8 && h>8){

			dragDiv.style.width= w+'px';
			dragDiv.style.height=h+'px';

			//判断左右
			dragDiv.style.left=Math.min(ev.clientX,originX)+'px';
			dragDiv.style.top=Math.min(ev.clientY,originY)+'px';

			dragDiv.style.display='block';
			//碰撞检测
			for (var index = 0; index < oFileItem.length; index++) {
				var element = oFileItem[index];
				var checkbox= element.querySelector('.checkbox');
				//对于高度的处理需要改进
				//var result=collisionTest( dragDiv , element );
				var result=tools.collisionRect(dragDiv , element );
				if(result){
					tools.addClass(element,'file-checked');
					tools.addClass(checkbox,'checked');
				}else{
					tools.removeClass(element,'file-checked');
					tools.removeClass(checkbox,'checked');				
				}
			}

			autoSelectAll();
		}

	}

	function mouseup(ev){
		if(dragDiv){
			dragDiv.style.display='none';
		}
		tools.removeEvent(document,'mousemove',mousemove);
		tools.removeEvent(document,'mouseup',mouseup)
	}

	function showTips(msg,cls){
		var tips=tools.$('.full-tip-box')[0];
		//每次都是从-32px开始
		tips.style.top='-32px';
		tips.style.transition='none';

		//因为dom都是统一设置的，所以需要一个timeout。【设置0s不代表0s,依据浏览器最小事件】
		setTimeout(function() {
			tools.addClass(tips,cls);
			tips.style.top='0';
			tips.style.transition='.5s';			
		}, 0);

		//hide tips,先关定时器，再开启
		clearInterval(tips.timer);
		tips.timer=setInterval(function(){
			tips.style.top='-32px';
		},2000);
		
		
		var text=tools.$('.text',tips)[0];
		text.innerText=msg;
	}

	//碰撞检测
	function collisionTest(obj1,obj2){
		var a_x1,a_x2,a_y1,a_y2;
		var b_x1,b_x2,b_y1,b_y2;
		a_x1=obj1.offsetLeft;
		a_x2=obj1.offsetLeft+obj1.offsetWidth;
		a_y1=obj1.offsetTop;
		a_y2=obj1.offsetTop+obj1.offsetHeight;

		b_x1=obj2.offsetLeft;
		b_x2=obj2.offsetLeft+obj2.offsetWidth;
		b_y1=obj2.offsetTop;
		b_y2=obj2.offsetTop+obj2.offsetHeight;

		var collisionX=false;
		var collisionY=false;
		/*
		if( b_x1 < a_x1 &&  a_x1 < b_x2 || b_x1 < a_x2 &&  a_x2 < b_x2   ){
			collisionX=true;
		}
		if( b_y1 < a_y1 &&  a_y1 < b_y2 || b_y1 < a_y2 &&  a_y2 < b_y2   ){
			collisionY=true;
		}*/

		if( b_x1 < a_x1 &&  a_x1 < b_x2 || b_x1 < a_x2 &&  a_x2 < b_x2 ||
			a_x1 < b_x1 &&  b_x1 < a_x2 || a_x1 < b_x2 &&  b_x2 < a_x2
		   ){
			collisionX=true;
		}
		if( b_y1 < a_y1 &&  a_y1 < b_y2 || b_y1 < a_y2 &&  a_y2 < b_y2||
			a_y1 < b_y1 &&  b_y1 < a_y2 || a_y1 < b_y2 &&  b_y2 < a_y2
		   ){
			collisionY=true;
		}		
		return collisionX && collisionY;
	}

	//文件hover click
	function fileSelectHandle(fileItem){

		var checkbox=tools.$('.checkbox',fileItem)[0];

		tools.addEvent(fileItem,'mouseenter',function(){
			tools.addClass(fileItem,'file-checked');

		})

		tools.addEvent(fileItem,'mouseleave',function(){
			if(tools.hasClass(checkbox,'checked')==false)
				tools.removeClass(fileItem,'file-checked');

		})

		tools.addEvent(checkbox,'click',function(ev){
			tools.toggleClass(checkbox,'checked');
			//检查全选
			autoSelectAll();
			//阻止冒泡
			ev.stopPropagation();
		})
		
	}
	
	//tree file navpath reload
	function reLoad(fileId) {

		currentFileId=fileId;

		//清除全选
		tools.removeClass(oSelectAll,'checked');
		//处理tree
		//清除原有选中项
		var treeItem=tools.$('.tree-nav')[0];
		tools.removeClass(treeItem,'tree-nav');
		//选择当前项
		//tools.$ 最后一个分支判断有问题，不能有效支持属性选择器，所以使用原生的
		treeItem=oTreeMenu.querySelector('.tree-title[data-file-id="'+fileId+'"]');
		tools.addClass(treeItem,'tree-nav');

		//处理filelist
		oFileList.innerHTML=createFileHtml(allFileCollection,fileId);
		var hasChilds=dataControl.hasChilds(allFileCollection,fileId);
		if(hasChilds==false){
			oEmpty.style.display='block';
		}else{
			oEmpty.style.display='none';
		}

		//处理Path
		oPathNav.innerHTML=createPathNavHtml(allFileCollection,fileId);


		//重新绑定事件
		tools.each(oFileItem,function(item,index){
			fileSelectHandle(item);
		})
	}

	//判断是否已经全选，如果已经全选打钩
	function autoSelectAll(){
		if(isSelectAll()){
			tools.addClass(oSelectAll,'checked');
		}else{
			tools.removeClass(oSelectAll,'checked');
		}
	}

	function isSelectAll(){
		if(document.querySelectorAll('.checkbox.checked').length== oFileItem.length)
		{
			return true;
		}
		return false;
	
	}
}())