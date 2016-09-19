
function getSingleFileCore(fileData) {

	var temple=`
		<div class="item" data-file-id="${ fileData.id}">
			<lable class="checkbox"></lable>
			<div class="file-img">
				<i></i>
			</div>
			<p class="file-title-box">
				<span class="file-title">${fileData.title}</span>
				<span class="file-edtor">
					<input class="edtor" value="${fileData.title}" type="text"/>
				</span>
			</p>
		</div>`;
	return temple;
}
function getSingleFileHtml(fileData) {
	var temple=`
		<div class="file-item">
			${getSingleFileCore(fileData)}
		</div>
	`;
	return temple;

}

//用于创建元素
function createSingleFileElement(fileData) {
	var div=document.createElement('div');
	div.className='file-item';
	div.innerHTML=getSingleFileCore(fileData);
	return div;
}

//创建特定pid下的文件列表
function createFileHtml(fileCollection,pid) {
	var children=dataControl.getChildById(fileCollection,pid);
	var html='';
	children.forEach(function (item,index) {
		html+= getSingleFileHtml(item);
	})
	return html;

}

function createTreeNodeHtml(data,pid) {
	var children=dataControl.getChildById(data,pid);
	var html='';
	html+='<ul>';
	children.forEach(function (item,index) {

		var hasChilds=dataControl.hasChilds(data,item.id);

		var className=hasChilds?'tree-contro' :'tree-contro-none';

		var level=dataControl.getLevelById(data,item.id);
		var padding=(level*14)+'px';
		//在模板内递归调用
		html+=`
				<li>
					<div data-file-id="${item.id}" class="tree-title ${className}" style="padding-left:${padding}">
						<span>
							<strong class="ellipsis">${item.title}</strong>
							<i class="ico"></i>
						</span>
					</div>
					${createTreeNodeHtml(data,item.id)}
				</li>
		`;		
	})
	html+='</ul>';

	return html;
}

//创建元素
function createSingleTreeNodeElement(data,level) {
	var li=document.createElement('ul');
	
	var html='';

	var className='tree-contro-none' ;
	var padding=(level*14)+'px';
	//在模板内递归调用
	html+=`
			<li>
				<div data-file-id="${data.id}" class="tree-title ${className}" style="padding-left:${padding}">
					<span>
						<strong class="ellipsis">${data.title}</strong>
						<i class="ico"></i>
					</span>
				</div>
			</li>
	`;
	li.innerHTML=html;
	return li;
}

//路径导航
function createPathNavHtml(data,id) {
	//这个parents包含当前元素
	var parents=dataControl.getParents(data,id);
	
	//反转一下数组
	parents.reverse();
	var html='';
	var length=parents.length;
	parents.forEach(function(item,index){
		if(index!=length-1){
			html+=`
			<a href="javascript:;" style="z-index:${length-index}" data-file-id="${item.id}">${item.title}</a>
			`;
		}

	})
	html+=`<span class="current-path" style="z-index:1">${parents.slice(-1)[0].title}</span>`;

	return html;

}


