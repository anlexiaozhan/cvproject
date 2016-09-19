
$(function(){

    //评分效果开始
    var oldStarPositionY=0;
    $('.product_rate li').mouseenter(function(){
        var index=$(this).index();
        var newStarPositionY=(index+1)*-16;
        //ff 不支持 background-position-Y
        //只能改写成background-position
        //'background-position-Y':newStarPositionY+'px'
        $(this).parent().css({
            'background-position':'0 '+newStarPositionY+'px'
        });
    })

    $('.product_rate li').click(function(){
        var index=$(this).index();
        var newStarPositionY=(index+1+5)*-16;
        $(this).parent().css({
            'background-position':'0 '+newStarPositionY+'px'
        });

        oldStarPositionY=newStarPositionY;
    });

    //恢复状态
    $('.product_rate ul').mouseleave(
        function(){
            $(this).css({
                'background-position':'0 '+oldStarPositionY+'px'
            });
        }
    )


    //tab
    $('.tab_menu li').click(function(){
        $(this).addClass('selected')
            .siblings().removeClass();
        var index=$(this).index();
        $('.tab_content div').removeClass()
            .eq(index).addClass('selected');
    });

    //选择尺寸
    $('.size_choose li').click(function(){
        $(this).addClass('selected').siblings().removeClass('selected');
        $('#size_text').text($(this).text());
    })

    //选择颜色
    $('.color_choose li').click(function(){
        $(this).addClass('selected').siblings().removeClass('selected');

        $(this).parent().siblings('#color_text').text(this.title);
        var imgSrc=$(this).find('img').attr('src');
        var start=imgSrc.lastIndexOf('/')+1;
        var end=imgSrc.lastIndexOf('.');
        var color=imgSrc.substring(start,end);
        var big=imgSrc.substring(0,start)+color+'_one_big.jpg';
        var small=imgSrc.substring(0,start)+color+'_one_small.jpg';
        //不需要设置 a的href值，因为已经使用了ref钩子
        //$('.zoomImg a').attr('href',big);
        $('.zoomImg img').attr('src',small);
        $('#thickboxImg').attr('href',big);

        $('.imgList li').hide();
        $('.imgList .'+color+'List').show();

        //做一次点击操作，防止切换颜色之后 还是之前的图片预览
        $('.imgList .'+color+'List').find('a').eq(0).click();

        
    });

    //选择数量，计算总价
    $('#num_select').change(function(){
        var num=$(this).val();
        var price=$('#nowPrice').text();
        var total=parseFloat(num)*parseFloat(price);

        $('#num_text').text(num);
        $('#total_money').text(total);
    }).change();
    //初始化颜色
    $('.color_choose li').eq(0).click();

    //点击下方图片
    $('.imgList li').click(function(){
        

        var imgSrc=$(this).find('img').attr('src');
        var small=imgSrc.replace('.jpg','_small.jpg');
        var big=imgSrc.replace('.jpg','_big.jpg');

        //$('.zoomImg a').attr('href',big);
        $('.zoomImg img').attr('src',small);
        $('#thickboxImg').attr('href',big);
    })

    //结算
    $('#btnCart').click(function(){
        var num=$('#num_select').val();
        var price=$('#nowPrice').text();
        var total=$('#total_money').text();

        var content='感谢购买';
        content+='<br/>';
        content+='<br/>';
        content+='<div style="font-size:12px;font-weight:400;">商品单价：'+price+'; 商品数量：'+num+';总价：'+total+'</div>';
        $('#cartDialogTitle').html(content);
        
        $('#basic-dialog-ok').modal();

    })

})


/*使用jqzoom*/
$(function(){
	$('.jqzoom').jqzoom({
		zoomType: 'standard',
		lens:true,
		preloadImages: false,
		alwaysOn:false,
		zoomWidth: 340,
		zoomHeight: 340,
		xOffset:10,
		yOffset:0,
		position:'right'
    });
});