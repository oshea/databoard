function histogram(el, dist, options){
	var width = options.width || 760;
	width = width - 20;
	var container = $("#" + el.attr("id")).width(width).height(500);
	$.plot(container, [dist], {
	            series: {
	                bars: { show: true }
	            }
	        });
}

function linegraph(el, values, options){
	var width = options.width || 760;
	width = width - 20;
	var container = $("#" + el.attr("id")).width(width).height(500);
	$.plot(container, [values], {
	            series: {
	                lines: { show: true }
	            },
				yaxis: {
					max: 1
				}
	        });
}

function histogram2(el, values, dist, options){
	// var values = d3.range(1000).map(randomIrwinHall(10));
	console.log("dist");
	console.log(dist);

	// A formatter for counts.
	var formatCount = d3.format(",.0f");

	var margin = {top: 10, right: 30, bottom: 30, left: 30},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var max = d3.max(values);
	var min = d3.min(values);
	
	console.log("MAX: " + max);
	
	console.log("width:");
	console.log(width);
	
	var x_domain = $.map(dist, function(x){ return x[0] });
	console.log("X DOMAIN:");
	console.log(x_domain);
	
	var x = d3.scale.linear()
	    .domain(x_domain)
	    .range(x_domain);
	
	// var bin_length = 
	// var start_val = 0;
	// var end_val = max + 
	// 
	// var x = d3.scale.quantize(values);
	
	// Generate a histogram using twenty uniformly-spaced bins.
	var x_bins = x.ticks(20);
	console.log("X BINS");
	console.log(x_bins);
	
	var data = d3.layout.histogram()
	    .bins(x_bins)
	    (values);
	
	console.log("DATA:");
	console.log(data);


	var y_values = $.map(dist, function(x) { return x[1] });
	var y_domain = [d3.min(y_values), d3.max(y_values)];
	console.log("Y DOMAIN:");
	console.log(y_domain);
		
	console.log("#1");
	var y = d3.scale.linear()
	    .domain(y_domain)
	    .range([height, 0]);

	console.log("#2");
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	console.log("#3");
	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g");
	    //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	console.log("#4");
	var bar = svg.selectAll(".bar")
	    .data(data)
	  .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

	console.log("#5");

	var bar_width = width/dist.length;
	bar_width = (bar_width * (data[1].x - data[0].x));
	console.log("BAR WIDTH:");
	console.log(bar_width);
	
	bar.append("rect")
	    .attr("x", 1) 
	    .attr("width", bar_width)
	    .attr("height", function(d) { return height - y(d.y); });

	console.log("#6");
	bar.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", x(data[0].dx) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return formatCount(d.y); });

	console.log("#7");
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	function randomIrwinHall(m) {
	  return function() {
	    for (var s = 0, j = 0; j < m; j++) s += Math.random();
	    return s / m;
	  };
	}
}

function histogram1(el, values, options){
	//var values = d3.range(1000).map(randomIrwinHall(10));

	// A formatter for counts.
	var formatCount = d3.format(",.0f");

	var margin = {top: 10, right: 30, bottom: 30, left: 30},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	    .domain([0, 1])
	    .range([0, width]);

	// Generate a histogram using twenty uniformly-spaced bins.
	var data = d3.layout.histogram(values);

	var y = d3.scale.linear()
	    .domain([0, d3.max(values, function(d) { 
			console.log(d);
			return d.y; 
		})])
	    .range([height, 0]);

	console.log("finished y");
	console.log(y);
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	console.log("finished x");
	var svg = el.append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	console.log("finished svg");
	var bar = svg.selectAll(".bar")
	    .data(data)
	  	.enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

	bar.append("rect")
	    .attr("x", 1)
	    .attr("width", x(data[0].dx) - 1)
	    .attr("height", function(d) { return height - y(d.y); });

	bar.append("text")
	    .attr("dy", ".75em")
	    .attr("y", 6)
	    .attr("x", x(data[0].dx) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return formatCount(d.y); });

	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);
	
	function randomIrwinHall(m) {
	  return function() {
	    for (var s = 0, j = 0; j < m; j++) s += Math.random();
	    return s / m;
	  };
	}
}