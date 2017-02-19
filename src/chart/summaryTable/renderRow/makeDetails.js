export function makeDetails(d) {
	var wrap = d3.select(this)


	var title = wrap.append("div").html(d=>d.value_col) 

	//add a short summary
	var summary_text = d.type == "categorical" ? " "+d.type + " variable with "+d.statistics.values.length+" levels" : " "+d.type + " variable"
	var summary_text_span = title.append("span")
	.attr("class","small")
	.text(summary_text)

	if(d.type == "categorical"){
		var value_list = d.statistics.values.map(m=>m.key+": "+d3.format("0.1%")(m.prop_n))
		var nValues = value_list.length;
		value_list = value_list.slice(0,10).join("\n")
		value_list = value_list.length > 10 ? 
			value_list + "\nAnd "+(nValues-10)+" more.":
			value_list

		summary_text_span.append("sup")
		.html("?")
		.style("cursor","pointer")
		.attr("title",value_list)		
	}
	

	//Render Summary Stats
	var stats_div = wrap.append("div").attr("class","stat-row")
	var statNames = Object.keys(d.statistics).filter(f => f!="values")
	var statList = statNames.map(function(stat){
		return {key: stat,value: d.statistics[stat]}
	})

	var stats = stats_div.selectAll("div").data(statList).enter().append("div").attr('class',"stat")
	stats.append("div").text(d=>d.key).attr("class","label")
	stats.append("div").text(d=>d.value).attr("class","value")
	
	//Render Values 
	
	if(d.type == "categorical"){
		//value table for categorical
		
	} else if(d.type=="continuous"){
		//min/maxes for continuous

	}
}