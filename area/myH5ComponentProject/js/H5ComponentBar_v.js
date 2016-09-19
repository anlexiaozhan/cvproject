/* 垂直柱图组件对象 */
var H5ComponentBar_v =function(name,cfg){

  var component =new H5ComponentBase (name,cfg);

  $.each(cfg.data,function(idx,item){
    var line= $('<div class="line">');
    var name=$('<div class="name">');
    var rate = $('<div class="rate">');
    var per=$('<div class="per">');

    //使用百分比作为高度，而不使用px
    var height=item[1]*100+'%';
    rate.css('height',height);

    var bgStyle='';
    //背景颜色
    if(item[2]){
      bgStyle='style="background-color:'+item[2]+'"'
    }
    var bg=$('<div class="bg" '+bgStyle+'></div>');

    name.text(item[0]);
    per.text(height);
    // 包含两部分 name,rate(per（数值）+bg增长)
    
    rate.append(per).append(bg);
    line.append(rate).append(name);

    //rate.append(bg).append(per);
    //line.append(name).append(rate);
    component.append(line);
  })

  return component;
}