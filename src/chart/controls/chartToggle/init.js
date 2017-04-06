/*------------------------------------------------------------------------------------------------\
  Initialize custom controls.
\------------------------------------------------------------------------------------------------*/

//export function init(selector, data, vars, settings) {
export function init(chart) {
  //initialize the wrapper
    var selector = chart.controls.wrap
        .append('div')
        .attr('class', 'chart-toggle')

    var showAllButton = selector.append("button").text("Show All Charts")
    .on("click",function(){
      chart.wrap.selectAll(".variable-row").classed("hiddenChart",false)
      chart.wrap.selectAll(".row-toggle").html("&#9660;")
    })

    var hideAllButton = selector.append("button").text("Hide All Charts")
    .on("click",function(){
      chart.wrap.selectAll(".variable-row").classed("hiddenChart",true)
      chart.wrap.selectAll(".row-toggle").html("&#9658;")
    })


}
