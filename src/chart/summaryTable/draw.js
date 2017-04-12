/*------------------------------------------------------------------------------------------------\
  draw/update the summaryTable
\------------------------------------------------------------------------------------------------*/

export function draw(chart) {
	//update Summary Text
	chart.summaryTable.updateSummaryText(chart)

	//enter/update/exit for variableDivs
	//BIND the newest data
	var varRows = chart.summaryTable.wrap
	.selectAll("div.variable-row")
	.data(chart.data.summary, d=>d.value_col)

	//ENTER
	varRows.enter()
	.append("div")
	.attr("class",function(d){
		return "variable-row hiddenChart "+d.type
	})

	//ENTER + Update
	varRows.each(chart.summaryTable.renderRow)

	//EXIT
	varRows.exit().remove()

}
