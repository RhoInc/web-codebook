/*------------------------------------------------------------------------------------------------\
  draw/update the summaryTable
\------------------------------------------------------------------------------------------------*/

export function draw(chart) {
	console.log(chart)
	//enter/update/exit for variableDivs
		
	//BIND the newest data
	var varRows = chart.summaryTable.wrap
	.selectAll("div.variable")
	.data(chart.data.summary, d=>d.value_col)

	//ENTER
	varRows.enter()
	.append("div")
	.attr("class","variable-row")
	
	//ENTER + Update
	varRows.each(chart.summaryTable.renderRow)

	//EXIT
	varRows.exit().remove()

}
