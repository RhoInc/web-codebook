export function makeDetails(d) {
	var wrap = d3.select(this)
	//Render Variable Name/Type
	var title = wrap.append("div").html(d=>d.value_col + " <span class='small'>"+d.type+"</span>")
	
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