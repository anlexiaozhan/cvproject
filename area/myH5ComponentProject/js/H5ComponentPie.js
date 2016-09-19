/* 饼图组件对象 todo */
var H5ComponentPie =function(name,cfg){

  var component=new H5ComponentBase(name,cfg);

  var w=cfg.width;
  var h=cfg.height;
  var cns=document.createElement('canvas');
  var ctx=cns.getContext('2d');
  //设置cns宽，高
  cns.width=w;
  cns.height=h;

  component.append(cns);

  var r=Math.floor(Math.min(w,h)/2);

  //0 name 1 per 2 color
  var randomColors=['red','orange','yellow','green','blue','purple'];
  //圆点x
  var orgX= r ;
  var orgY=orgX;
  var lastAngle=0;
  var nowAngle=0;
  
  function draw(per){
    ctx.clearRect(0,0,w,h);
    var temp=per*2*Math.PI;
    
    for (var index = 0; index < cfg.data.length; index++) {
      ctx.beginPath();
      //注意：每次arc之前moveTo圆点
      ctx.moveTo(orgX,orgY);

      var item = cfg.data[index];
      //本次结束角度需要以上一次的为基准
      nowAngle= (lastAngle + item[1]*2*Math.PI)* per;
      ctx.fillStyle= item[2]!=undefined ? item[2] : randomColors[index];
      ctx.arc(orgX,orgY,r,lastAngle,nowAngle);
      ctx.fill();

      lastAngle=nowAngle;
    }  
  }

  component.on('onLoad',function(){
    var per=0;
    for (var i = 0; i < 100; i++) {
      setTimeout(function() {
        draw(per+=0.01);
        console.log(per);
      }, 20+600);
      //600 作为一个延迟
    }
  })

  return component;
}










