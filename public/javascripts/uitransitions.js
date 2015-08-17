var searchClicked = false;
var firstTime = true;
$('#searchButton').click(function(){
	if($("#searchbox1").attr('class') != 'searchbox1'){
		searchClicked = true;
		$(".textholder").remove();
		$("#search").css('display','inherit');
		$("#searchbox1").attr("class","searchbox1");
                $("#searchbox2").attr("class","searchbox2");
		$("#searchdiv1").attr("class","searchdiv slideDown");
		$("#searchdiv2").attr("class","searchdiv slideDown");
		$('div :input').fancyInput();
	}
	else
	{
		searchClicked = false;
		//$("#search").css('display','none');
		$("#searchbox1").attr("class","hiddensearchbox1");
		$("#searchbox2").attr("class","hiddensearchbox2");
                $("#searchdiv1").attr("class","searchdiv slideUp");
                $("#searchdiv2").attr("class","searchdiv slideUp");
                $(".textholder").remove();
		$('div :input').fancyInput();
	}
});

