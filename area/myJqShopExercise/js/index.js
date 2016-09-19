$(function(){
    //清空input
    $('.search_text').focus(function(){
        $(this).addClass('focus');

        if($(this).val()==this.defaultValue){
            $(this).val('');
        }
        
    }).blur(function(){
        $(this).removeClass('focus');
        if($(this).val()==''){
            $(this).val('请输入商品名称');
        }
    });

    //hover显示子菜单
    $('#nav li').hover(function(){
        $(this).find('.nav_item').show();
    },
        function(){
             $(this).find('.nav_item').hide();
        }
    )

    //颜色皮肤
    $('#skin li').click(function(){
        $(this).addClass('selected')
            .siblings().removeClass('selected');
        var href='css/'+this.id+'.css';
        $('#skin_css').attr('href',href);

        //在chrome 本地测试是无法有效使用cookie的
        $.cookie('skin_css',this.id,{path:'/',expires:10});
    });

    var skin_css=$.cookie('skin_css');
    var defaultSkinCss='skin_0';

    if(skin_css && skin_css !=defaultSkinCss){
        $('#'+skin_css).click();
    }

    //add hot

    $('.hotHome').append('<i class="hot"></i>');
    //ad 效果
    function switchImage(index,$self){

        //如果没有传入 $self，则赋值
        if( ! $self){
            $self=$('.carousel li').eq(index);
        }
        $self.addClass('choose').siblings().removeClass('choose');
        var imgs=$('.carousel>a img');
        var img=imgs.eq(index);
        //淡入 淡出
        imgs.fadeOut();
        img.fadeIn();
        var a=$('.carousel>a');
        //将li下a的href给 共用的a
        a.attr('href',$self.find('a').attr('href') );
    }

    var adTimer=null;
    var adIndex=0;
    var adLength=5;
    function autoSwitchImage(){

        adTimer=setInterval(function(){
            adIndex++;
            if(adIndex>=adLength){
                adIndex=0;
            }
            switchImage(adIndex,null);
        },2500
        );
    }

    autoSwitchImage();

    $('.carousel li').hover(function(){

        var index=$(this).index();
        clearInterval(adTimer);
        adIndex=index;
        switchImage(index,$(this));

    },function(){
        autoSwitchImage();
    })
    //tooltip

    $('.tooltipHome').mouseover(function(ev){
        var tooltip='<div class="tooltip" id="tooltip">'+ this.innerText+'</div>';
        tooltip=$(tooltip);
        tooltip.css({
            left:(ev.pageX+10)+'px',
            top:(ev.pageY+10)+'px'
        });
        $('body').append(tooltip);

    }).mouseout(function(){
        $('#tooltip').remove();
    }).mousemove(function(){
        
    })

    //tab 切换
    var offsetLeft=$('.brand_listInner li').outerWidth(true)*4;

    $('.brand_tab li').click(function(){

        $(this).addClass('selected').siblings().removeClass('selected');
        var index=$(this).index();

        $('.brand_listInner ul').stop(true,false)
            .animate({left:-offsetLeft*index},1000);

    })

    //tab li zoom遮罩层

    $('.brand_listInner li').append('<div class=" imageMask"></div> ');
    $('.brand_listInner li').delegate('.imageMask','hover',function(){
        $(this).toggleClass('imageOver');
        console.log(this);
    })

    $('.imageMask').click(function(){
        window.open('detail.html');
    })
    
}
)