var utils = {
	tuples_to_graph: function(data, options){
		// console.log(data);
		var options = {} || options;
		var x_pos = options.x_pos || 0;
		var y_pos = options.y_pos || 1;
		var graph_data = [];

		for(var i=0;  i<data.length; i++){
			var di = data[i];
			// console.log(di);
			var d = {};
			d.x = di[x_pos];
			d.y = di[y_pos];
			graph_data.push(d);
		}
		console.log(graph_data);
		return graph_data;
	},
	format_timestamp: function(ts){
		var diff = Math.abs(new Date() - ts);
		var min_ago = Math.round(diff/(1000 * 60));
		if(min_ago == 0){
			return "just now";
		}else if(min_ago == 1){
			return min_ago + " minute ago";
		}else{
			return min_ago + " minutes ago";
		}
	},
	format_number: function(n, places){
		function format_number_decimals(pnumber,decimals){
		    if (isNaN(pnumber)) { return 0};
		    if (pnumber=='') { return 0};
			function isInt(n) {
			   return n % 1 === 0;
			}

			if(isInt(n)){
				return n;
			}

		    var snum = new String(pnumber);
		    var sec = snum.split('.');
		    var whole = parseFloat(sec[0]);
		    var result = '';

		    if(sec.length > 1){
		        var dec = new String(sec[1]);
		        dec = String(parseFloat(sec[1])/Math.pow(10,(dec.length - decimals)));
		        dec = String(whole + Math.round(parseFloat(dec))/Math.pow(10,decimals));
		        var dot = dec.indexOf('.');
		        if(dot == -1){
		            dec += '.'; 
		            dot = dec.indexOf('.');
		        }
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    } else{
		        var dot;
		        var dec = new String(whole);
		        dec += '.';
		        dot = dec.indexOf('.');     
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    }   
		    return result;
		}
		function add_commas(nStr) {
		    nStr += '';
		    var x = nStr.split('.');
		    var x1 = x[0];
		    var x2 = x.length > 1 ? '.' + x[1] : '';
		    var rgx = /(d+)(d{3})/;

		    while (rgx.test(x1)) {
		        x1 = x1.replace(rgx, '$1' + ',' + '$2');
		    }

		    return x1 + x2;
		}
		places = places || 2;
		n = format_number_decimals(n, places)
		n = add_commas(n);
		return n;
	}
};