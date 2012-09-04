$(document).ready(function(){
	// Resize content, left, right center
	
	var left_width = 75;
	var right_width = 75;
	var width = $("#content").width();
	var content_width = width - (left_width + right_width);
	
	$("#page_container").width(width - (40 * 2));
	// $("#left").width(left_width);
	// $("#center").width(content_width);
	// $("#right").width(right_width);
	// console.log("setting widths");
	// console.log([width, left_width, right_width]);
	
	controller.setContentWidth(content_width - (20 *2));
	controller.waitForData();
});