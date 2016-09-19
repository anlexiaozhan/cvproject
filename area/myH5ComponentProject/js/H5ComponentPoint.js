/* 散点图表组件对象 */
var H5ComponentPoint =function(name,cfg){

    var component=new H5ComponentBase(name,cfg);

    // 以第一个数据的大小的 100%
    var base=cfg.data[0][1];
    $.each(cfg.data,function(idx,item){
        var value=item[1]*100;
        //0 name 1 per 2 color 3 left 4 top
        var point=$('<div class="point" >');
        var name=$('<div class="name" >'+item[0]+'</div>');
        var per=$('<div class="per" >'+value+'%'+'</div>');

        name.append(per);
        point.append(name);

        var rate=(value/base)+'%';
        point.width(rate).height(rate);

        if(item[2]){
            point.css('background-color',item[2]);
        }

        if(item[3]!=undefined &&item[4]!= undefined ){

            point.css('left',item[3]);
            point.css('top',item[4]);
            
        }

        point.css('transition','all '+idx* 0.5+'s');

        

        component.append(point);
    });
    //point 的点击效果
    component.find('.point').on('click',function(){

        component.find('.point').removeClass('point_focus');
        $(this).addClass('point_focus');

        return false;
    });
    //第一个元素模拟点击效果
    component.find('.point').eq(0).addClass('point_focus');
    return component;
}