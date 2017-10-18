// JavaScript Document
//日期选择
!function(){
	laydate({elem: '#start-data',
	istime: true, format: 'YYYY-MM-DD'});//绑定元素
	laydate({elem: '#end-data',
	istime: true, format: 'YYYY-MM-DD'});//绑定元素
	laydate({elem: '#life-month',
	istime: true, format: 'YYYY-MM'});//绑定元素
}();
//轨迹类型选择
$(".life-class li").click(function(){
	$(this).toggleClass("life-check");	
});
//隔行变色table
/*var table=document.getElementById("life-table");
for(var i=0; i<table.tBodies[0].rows.length;i++){
	if(i%2)
	{
		table.tBodies[0].rows[i].style.backgroundColor="#f5f5f5";
	}
	else
	{
		table.tBodies[0].rows[i].style.backgroundColor="#fafafa";
	}
}*/
//隔行变色ul
var lifeBox=$(".life-box").length;
for(var c=0; c<lifeBox; c++){
	if(c%2)
	{
		$(".life-box")[c].style.backgroundColor="#f5f5f5"
	}
	else
	{
		$(".life-box")[c].style.backgroundColor="#fafafa";
	}
}
//高度问题
function lrHeight(){
	var titleHeight=$(".index-left h1").outerHeight();
	var lpLength=$(".life-person").find("li").length;
	var lpHeight=$(".life-person li:first").outerHeight();
	var allHeight=titleHeight+lpLength*lpHeight;
	$(".index-left").height(allHeight);
	$(".index-right").height(allHeight);
}
//横向滚动
var horwheel = require('horwheel'),
view = document.getElementById('index-warp');
lifeTime = document.getElementById('life-time');
horwheel(view);
horwheel(lifeTime);
//同步滚动
function moveUp_Left()
{
    //先删除右侧DIV的滚动事件，以免自动触发
    $("#index-warp").removeAttr("onScroll");
    //正常设值，同步两个DIV的滚动幅度
    $("#index-warp").scrollLeft($("#life-time").scrollLeft());
    //取消延迟预约。【重点】鼠标滚动过程中会多次触发本行代码，相当于不停的延迟执行下面的预约
    //clearTimeout(timer);
    //延迟恢复（预约）另一个DIV的滚动事件，并将本预约返回给变量[timer]
    timer = setTimeout(function() {
        $("#index-warp").attr("onScroll","moveUp_Right();");
    }, 300 );
}
function moveUp_Right()
{
    $("#life-time").removeAttr("onScroll");
    $("#life-time").scrollLeft($("#index-warp").scrollLeft());
    //clearTimeout(timer);
    timer = setTimeout(function() {
        $("#life-time").attr("onScroll","moveUp_Left();");
    }, 300 );
}
//月份的改变
$(function(){
	$("#life-time").scroll(function(){
		$(".life-time-contant ul").each(function(){
			var line=141;
			var target=parseInt($(this).offset().left);
			var lifeNo=$(this).index();
			if(target<=line){
				var lifeMonth=$(".life-time").eq(lifeNo).attr("life-month");
				$("#life-month").val(lifeMonth);
			}
		});
	});
});
//top伸缩
$(".slide-top").click(function(){
	if($(".top").outerHeight()==74){
		$(".top").animate({'height':0},200);
		$(".index").animate({'top':0},300);
	}else{
		$(".top").animate({'height':73},300);
		$(".index").animate({'top':74},200);	
	}
});