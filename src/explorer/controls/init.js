export function init(chart) {
    chart.controls.wrap.attr('onsubmit', 'return false;');
    chart.controls.wrap.selectAll('*').remove();  //Clear controls.

  	//Make file selector
    
	var file_select_wrap = chart.controls.wrap.append("div")	
	.style("padding",".5em")
	.style("border-bottom","2px solid black")

	chart.controls.wrap.append("span").text("Pick a file: ")
	var select = d3.select(".controls").append("select")

	select.selectAll("option")
	.data(chart.controls.config.files)
	.enter()
	.append("option")
	.text(function(d){return d.label})

	select.on("change",function(d){
//		makeCodebook(this.value)
	})
}


