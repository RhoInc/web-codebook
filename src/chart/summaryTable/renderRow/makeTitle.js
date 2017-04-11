export default function makeTitle(d) {
	var wrap = d3.select(this)
	var titleDiv = wrap.append('div').attr("class","var-name")
	var valuesList = wrap.append('ul').attr("class","value-list")

	//Title and type
	titleDiv.append("div").attr("class","name").html(d=>d.value_col)
	titleDiv.append("div").attr("class","type").html(d=>d.type)

	//make a list of values
	if(d.type=="categorical"){
		//valuesList.append("span").text( "Values (Most Frequent):")
		var topValues = d.statistics.values
		.sort(function(a,b){
			return b.n - a.n
		})
		.filter(function(d,i){return i<5})

		valuesList.selectAll("li")
		.data(topValues)
		.enter()
		.append("li")
		.text(d=>d.key+" ("+d3.format("0.1%")(d.prop_n)+")")
		.attr("title",d=>"n="+d.n)
		.style("cursor", "pointer")

		if(d.statistics.values.length > 5){
			var totLength =d.statistics.values.length
			var extraCount = totLength - 5
			var extra_span = valuesList.append("span").html("and "+extraCount+" more.")
		}
	}else if(d.type=="continuous"){
		//valuesList.append("span").text( "Values (Most Frequent):"
		var sortedValues = d3.set(d.values).values() //get unique
		.map(d=>+d) //convert to numeric
		.sort(function(a,b){return a-b}) // sort low to high

		var minValues = sortedValues.filter(function(d,i){return i<3})
		var nValues = sortedValues.length
		var maxValues = sortedValues.filter(function(d,i){return i>=nValues-3})
		var valList = d3.merge([minValues,["..."],maxValues])

		valuesList.selectAll("li")
		.data(valList)
		.enter()
		.append("li")
		.text(d => d)
		.attr("title", d => d=="..."? nValues-6+" other values" :"")
		.style("cursor", d=> d=="..."?"pointer":null)
	}

/*
	var summary_text = d.type == 'categorical' ? ' '+d.type + ' variable with '+d.statistics.values.length+' levels' : ' '+d.type + ' variable'
	var summary_text_span = title.append('span')
	.attr('class','small')
	.text(summary_text)

	if(d.type == 'categorical'){
		var value_list = d.statistics.values.map(m=>m.key+': '+d3.format('0.1%')(m.prop_n))
		var nValues = value_list.length;
		value_list = value_list.slice(0,10).join('\n')
		value_list = nValues > 10 ?
			value_list + '\nAnd '+(nValues-10)+' more.':
			value_list

		summary_text_span.append('sup')
		.html('?')
		.style('cursor','pointer')
		.attr('title',value_list)
	}
	*/
}
