/*------------------------------------------------------------------------------------------------\
  Initialize group controls.
\------------------------------------------------------------------------------------------------*/

export function init(chart) {
     if (chart.config.groups.length > 0) {
	    var selector = chart.controls.wrap
            .append('div')
            .attr('class', 'group-select');

    	selector.append("span")
            .text("Group by")

    	var groupSelect = selector.append("select")

    	var groupLevels = d3.merge([["None"],chart.config.groups.map(m=>m.value_col)])

    	groupSelect.selectAll("option")
            .data(groupLevels)
            .enter()
            .append("option")
            .text(d=>d)

    	groupSelect.on("change",function(){
            if (this.value !== 'None')
                chart.config.group = this.value;
            else
                delete chart.config.group;
            chart.data.filtered = chart.data.makeFiltered(chart.data.raw, chart.config.filters)
            chart.data.makeSummary(chart)
            chart.summaryTable.draw(chart);
    	})

    }
}
