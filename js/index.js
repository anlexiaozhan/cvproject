
window.onload=function(){
	//兼容ie8不支持getElementsByClassName
    if(!document.getElementsByClassName){  
        document.getElementsByClassName = function(className, element){  
            var children = (element || document).getElementsByTagName('*');  
            var elements = new Array();  
            for (var i=0; i<children.length; i++){  
                var child = children[i];  
                var classNames = child.className.split(' ');  
                for (var j=0; j<classNames.length; j++){  
                    if (classNames[j] == className){   
                        elements.push(child);  
                        break;  
                    }  
                }  
            }   
            return elements;  
        };  
    }

    var btnClose=document.getElementsByClassName('close')[0];
    var popUp=document.getElementsByClassName('popup')[0];
    var data=[
        {
            name:'微云',
            links:['area/weiyun_exercise/index.html'],
            desc:'本项目使用ES6模板进行树形列表、文件夹内容、路径导航区域数据渲染。使用原生JS实现全选单选、新建文件夹、拖拽选择功能。（html布局采用的miaov公开课版本）'
        },
        {
            name:'Jane Shop',
            links:['area/myJqShopExercise/index.html',
                'area/myJqShopExercise/detail.html'
                ],
            desc:'本项目采用jQuery实现网页换肤，居中广告轮播图，品牌活动鼠标移入效果，以及产品评分等功能。在结合jq插件基础上完成产品图片放大镜效果，显示产品大图，价格数量联动等。'
        },
        {
            name:'IT教育网H5组件开发',
            links:['area/myH5ComponentProject/index.html'],
            desc:'移动端项目。本项目采用组件式开发模式，开发Web App全站。使用CSS3和jQuery.animate实现进场，退场动画效果。运用html和canvas完成柱状图，散点图，折线图的绘制。使用fullPage.js全屏滚动。'
        },
        {
            name:'淘宝移动端',
            links:['area/my_taobao_practice/index.html'],
            desc:'本项目依据不同设备的像素比devicePixelRatio动态调整rem，实现移动端布局。布局过程中，运用了flex，细节方面，使用图标字体iconfont，为了便于计算rem，借助了less。'
        },
        {
            name:'电商首页',
            links:['area/ds_exercise/index.html'],
            desc:'本项目实现了一个基本的电商首页功能布局，包括搜索框，产品分类导航，分类产品列表。'
        }
        
        
    ]
    btnClose.onclick=function(){
        
        popUp.style.display='none';
    }

    var list=document.querySelectorAll('#projectList li');
    var pop_name=document.getElementsByClassName('pop_name',popUp)[0];
    var pop_linkList=popUp.getElementsByTagName('ul')[0];
    var pop_desc=document.getElementsByClassName('pop_desc',popUp)[0];


    
    for (var index = 0; index < list.length; index++) {
        var element = list[index];
        element.index=index;
		//处理ie8 attachEvent
		if(element.attachEvent){
			element.attachEvent('onclick',function(){
				//处理ie8 this
				liClick.call(element);
			})
		}else{
			element.addEventListener('click',liClick,false);
		}
    }
	
	function liClick(){
            var _data=data[this.index];
            pop_name.innerText=_data.name;
            var str='';
            for (var i = 0; i < _data.links.length; i++) {
                var link = _data.links[i];
                var linkName=link.substring(link.lastIndexOf('/')+1);
                str+='<li><a href="'+link+'" target="_blank" >'+linkName+'</a></li>';
            }
            pop_linkList.innerHTML=str;
            pop_desc.innerText=_data.desc;
            popUp.style.display='block';		
		
	}
}