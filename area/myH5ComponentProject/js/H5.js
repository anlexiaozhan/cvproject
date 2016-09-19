/* 内容管理对象 */
var H5=function(){
    
    this.id= ('h5_'+Math.random()).replace('.','_');
    //el > page > component
    this.el=$('<div class="h5" id="'+ this.id +'"></div>').hide();
    this.page=[];
    $('body').append(this.el);


    this.addPage=function(name,text){

        var page=$('<div class="h5_page section" ></div>');
        if  (name!=undefined){
            page.addClass('h5_page_'+name);
        }
        if(text!=undefined){
            page.text(text);
        }

        this.el.append(page);

        this.page.push(page);

        //当页面新增完毕之后的事件（本项目存在于index.html）
        typeof this.whenAddPage =='function' && this.whenAddPage();

        //链式操作
        return this;
    }

    this.addComponent=function(name,cfg){

        var cfg=cfg||{};
        cfg=$.extend({
            type:'base'
        },cfg);

        var component;
        //最近操作的页面
        var page=this.page.slice(-1)[0];
        switch(cfg.type){
            case 'base':
                component=new H5ComponentBase(name,cfg);
                break;
            case 'bar':
                component=new H5ComponentBar(name,cfg);
                break;
            case 'polyline':
                component=new H5ComponentPolyline(name,cfg);
                break;
            case 'bar_v':
                component=new H5ComponentBar_v(name,cfg);
                break;
            case 'point':
                component=new H5ComponentPoint(name,cfg);
                break;
            case 'pie':
                component=new H5ComponentPie(name,cfg);
                break;
        }
        //todo
        page.append(component);
        
        return this;
    }

    
    //加载器 触发加载事件 并且显示H5
    this.loader=function(firstPage){
        //页面（fullpage事件）加载后 触发 component 事件
        this.el.fullpage({
            onLeave:function(index,nextIndex,direction){
                $(this).find('.h5_component').trigger('onLeave');
            },
            afterLoad:function(anchorLink,index){
                $(this).find('.h5_component').trigger('onLoad');
            }

        });
        //调用loader之后才会显示页面
        this.el.show();
        //firstPage 用来立即切换到某一页，传入页码即可，方便调试
        if(firstPage){
            $.fn.fullpage.moveTo(firstPage);
            
        }else{
            this.page[0].find('.h5_component').trigger('onLoad');
        }
    }


    return this;
}