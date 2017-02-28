/*------------------------------------------------------------------------------------------------\
  Initialize group controls.
\------------------------------------------------------------------------------------------------*/

export function init(chart) {
    console.log(chart)
    console.log(chart.config)

    if(chart.config.groups.length > 0){
	    var selector = chart.controls.wrap
    	.append('div')
    	.attr('class', 'group-select');

    	selector.append("span")
    	.text("Group by:")

    	var groupSelect = selector.append("select")

    	var groupLevels = d3.merge([["None"],chart.config.groups.map(m=>m.value_col)])
    	console.log(groupLevels)
    	
    	groupSelect.selectAll("option")
    	.data(groupLevels)
    	.enter()
    	.append("option")
    	.text(d=>d)

    	groupSelect.on("change",function(){
    		console.log(this.value)
    	})

    }
}
