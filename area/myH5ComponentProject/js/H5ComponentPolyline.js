/* 折线组件对象 */
var H5ComponentPolyline=function(name,cfg){
  var component= new H5ComponentBase(name,cfg);
  var w=cfg.width;
  var h=cfg.height;
  
  //网格线 画布
  var cns=document.createElement('canvas');
  var ctx=cns.getContext('2d');

  cns.width=w;
  cns.height=h;

  component.append(cns);
  
  //横向线条grid
  var step=10;

  ctx.beginPath();
  ctx.strokeStyle='rgb(208,208,208)';
  ctx.lineWidth=1;

  for(var i=0;i<step+1;i++){
    var y=h/step*i;
    ctx.moveTo(0,y);
    ctx.lineTo(w,y);
  }

  //绘制纵向grid
  step=cfg.data.length+1;
  for (var index = 0; index < step+1; index++) {
    var x=w/step*index;
    ctx.moveTo(x,0);
    ctx.lineTo(x,h);
  }
  ctx.stroke();
  

  //第一个格子的开始位置
  var start_x=w/step;

  //底部文字
  //因为这边是文字的html的宽度，所以需要除以2
  //往左偏移 二分之一*二分之一的宽度
  var leftOffset=start_x/2/2* -1;
  var text_width=(start_x/2>>0) +'px';
  for (var index = 0; index < cfg.data.length; index++) {
    var value = cfg.data[index][0];
    var left=leftOffset+start_x*(index+1)/2+'px';
    var text=$('<div class="text" style="left:'+left+';width:'+text_width+'">');
    text.text(value);

    component.append(text);
  }

  //数据层
  //使用第二个canvas，因为生长过程每次都需要清空画布，而不能影响到第一次ctx生成的网格
  var cns2 = document.createElement('canvas');
  var ctx2 = cns2.getContext('2d');
  cns2.width = ctx2.width = w;
  cns2.height = ctx2.height =h;
  component.append(cns2);

  //使用此函数绘制生长动画
  function draw(per){
    //***函数内部使用的都是ctx2，不是ctx
    ctx2.beginPath();//如果不使用beginPath。这里的clearRect无效，why??
    
    //每次定时调用前，清空画布
    ctx2.clearRect(0,0,w,h);

    //画点
    var points=[];
    
    var x=0;
    var y = 0;

    ctx2.font="24px sans-serif";
    ctx2.lineWidth=2;
    ctx2.strokeStyle='red';
    
    /*画点 */
    for (var index = 0; index < cfg.data.length; index++) {

      x = start_x*(index+1);
      //per 用于生长曲线的增长过程
      y = h-(cfg.data[index][1]*h*per);
      //不要忘了使用moveTo，否则 就会造成意外的线条产生
      ctx2.moveTo(x,y);
      ctx2.arc(x,y,6,0,Math.PI*2);
      
      points.push({ x:x,y:y });

      //折线上的数值
      ctx2.fillStyle = cfg.data[index][2] ? cfg.data[index][2] : '#595959';
      ctx2.fillText(　Math.floor(cfg.data[index][1]*100) +'%',x,y-10);
    }


    ctx2.moveTo(points[0].x,points[0].y);

    /*连线*/
    for (var index = 0; index < points.length; index++) {
      var element = points[index];
      ctx2.lineTo(element.x,element.y);
    }

    //注意stroke
    ctx2.stroke();
    ctx2.lineTo(x,h);
    ctx2.lineTo(start_x,h);
    ctx2.closePath();

    ctx2.fillStyle = 'rgba(255, 136, 120, 0.2)';
    ctx2.fill();
    

  }

  component.on('onLoad',function(){
    var per=0;

    for(var i=0;i<100;i++){
      setTimeout(function() {
        per+=0.01;
        draw(per);
      }, i*10+500);
    }
    

  })

  component.on('onLeave',function(){

  })

  return component;
}