/*------------------------------------------------------------------------------------------------\
  Generate HTML containers.
\------------------------------------------------------------------------------------------------*/

export function layout() {  
    this.controls.wrap = this.wrap
        .append('div')
        .attr('class', 'controls');

    this.summaryTable.wrap = this.wrap
        .append('div')
        .attr('class', 'summaryTable');

    this.summaryTable.summaryText = this.summaryTable.wrap
    .append("strong")
    .attr("class","summaryText")
}
