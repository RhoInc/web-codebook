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
}
