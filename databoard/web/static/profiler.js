var DataProfile = Class.extend({
	containerSelector: function(){
		return this.id;
	},
	fieldContainerSelector: function(f){
		return this.id + "_" + f;
	},
	containerD3Selector: function(){
		return '#' + this.id;
	},
	fieldContainerD3Selector: function(f){
		return '#' + this.id + "_" + f;
	},
	init: function(data){
		console.log("DataProfile init");
		console.log(data);
		this.id = data.id;
		this.type = data.type;
		this.data = data.data;
		this.timestamp = new Date(data.timestamp*1000);
		this.name = data.name || null;
		this.processed_data = data.processed_data || {};
		this.keyValueData = [];
		this.content_width = null;
	},
	renderProfile: function(){
		d3.select("#data").selectAll("div").remove();
		
		var d3_container = d3.select("#data").insert("div");
		d3_container.attr("id", this.containerSelector());
		d3_container.append("div")
					.attr('class', 'profile_header')
					.text(this.name)
					.append('span')
					.text("Created " + utils.format_timestamp(this.timestamp));
		

		// this.renderField(d3_container, "data", this.data);
		
		for (var i=0; i < this.processed_data.length; i++) {
			var prop = this.processed_data[i];
			try{
				this.renderField(d3_container, prop.key, prop);
			}catch(e){
				console.log("Error rendering field: " + prop.key);
				throw e;
			}
		};

		var kv_container = d3_container.append('div').attr("class", 'kv_container');
		kv_container.append("p").attr('class', 'plot_header').text("Summary Statistics");
		var kv_table = kv_container.append("table").attr('class', 'kv_table');
		this.renderKeyValues(kv_table);
	},
	renderField: function(container, key, data){
		var d3_el = container.append("div").attr("id", this.fieldContainerSelector(key));
		if(this['render_' + key]){
			this['render_' + key](d3_el, data);
		}else{
			this.render(d3_el, key, data);
		}
	},
	render: function(d3_el, key, data){
		if(data.output == 'histogram'){
			this.renderHistogram(d3_el, key, data);
		}else if(data.output == 'linegraph'){
			this.renderLineGraph(d3_el, key, data);
		}else{
			this.renderKeyValue(d3_el, key, data);
		}
	},
	renderKeyValues: function(container){
		function formatValue(v){
			return utils.format_number(v);
		}
		
		console.log("rendering kv table");
		
		var column_count = 4;
		var column_percent_width = 100/column_count;
		var row_count = 0;
		var row = null;
		
		for (var i=0; i < this.keyValueData.length; i++) {
			var m = i % column_count;
			console.log(m);
			if(!m){
				row = container.append("tr");
			}
			var d = this.keyValueData[i];
			
			var kvcont = row.append("td").attr('class', 'kv_stat').attr('width', column_percent_width + "%");
			kvcont.append('p').attr('class', 'kv_name').text(d.name);
			kvcont.append("p").attr('class', 'kv_value').text(formatValue(d.data));
		}
		
		//Add empty cells to fill out row
	},
	renderKeyValue: function(container, key, data){
		this.keyValueData.push(data);
	},
	renderPlotHeader: function(container, key, data){
		container.append("p").attr('class', 'plot_header').text(data.name);
		console.log("RENDER HEADER FOR:");
		console.log(data);
	},
	renderHistogram: function(container, key, data){
		this.renderPlotHeader(container, key, data);
		var plot_cont = container.append("div");
		plot_cont.attr("id", this.fieldContainerSelector(key) + "_plot");
		histogram(plot_cont, data.data, { width:this.content_width });
	},
	renderLineGraph: function(container, key, data){
		this.renderPlotHeader(container, key, data);
		var plot_cont = container.append("div");
		plot_cont.attr("id", this.fieldContainerSelector(key)+ "_plot");
		linegraph(plot_cont, data.data, { width:this.content_width });
	},
	setContentWidth: function(width){
		this.content_width = width;
	}
});

var NumberList = DataProfile.extend({

});


var TimeSeries = DataProfile.extend({
	// id, type, data, processed_data, timestamp
	render: function(d3_el, name, data){
		this.renderKeyValue(d3_el, name, data);
		// d3.select("#data").selectAll("p")
		//     .data([4, 8, 15, 16, 23, 42])
		//   .enter().append("p")
		//     .text(function(d) { return "I’m number " + d + "!"; });
		// 
		// d3.select("#data").selectAll("p")
		//     .data([45])
		//   .enter().append("p")
		//     .text(function(d) { return "I’m number " + d + "!"; });
	},
	render_distribution: function(d3_el, data){
		console.log(d3_el.attr('id'));
		var el = document.querySelector("#" + d3_el.attr('id'));
		console.log(el);
		var graph = new Rickshaw.Graph( {
		        element: el,
		        width: 580,
		        height: 250,
				renderer: 'bar',
		        series: [ {
		                color: 'steelblue',
		                data: utils.tuples_to_graph(data)
		        } ]
		} );

		graph.render();
		
		var hoverDetail = new Rickshaw.Graph.HoverDetail( {
		    graph: graph
		} );
		// var w = 20,
		//      h = 80;
		//  
		// 			    var x = d3.scale.linear()
		//      .domain([0, 1])
		//      .range([0, w]);
		//  
		//  var y = d3.scale.linear()
		//      .domain([0, 100])
		//      .rangeRound([0, h]);
		// 
		// var chart = d3_el.append("svg")
		//      .attr("class", "chart")
		//      .attr("width", w * data.length - 1)
		//      .attr("height", h);
		// 
		// chart.selectAll("rect")
		//      .data(data)
		//    .enter().append("rect")
		//      .attr("x", function(d, i) { return x(i) - .5; })
		//      .attr("y", function(d) { return h - y(d[1]) - .5; })
		//      .attr("width", w)
		//      .attr("height", function(d) { return y(d[1]); });
	}
});

var profileFactory = {
	get: function(data){
		console.log("getting from factory");
		console.log(data);
		var object = null;
		if(data.type === 'number_list'){
			console.log('its a list!');
			object = new NumberList(data);
		}
		return object;
	}
}

var controller = {
	handleData: function(data){
		console.log(data);
		profile = profileFactory.get(data);
		profile.setContentWidth(this.content_width);
		profile.renderProfile();
	},
	waitForData: function(){
		var wfd = function(){
			$.get('/data', function(data) {
				profile = jQuery.parseJSON(data);
				controller.handleData(profile);
				wfd();
			});
		};
		
		wfd();
	},
	setContentWidth: function(width){
		this.content_width = width;
	}
}