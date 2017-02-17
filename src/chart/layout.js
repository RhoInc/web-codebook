/*------------------------------------------------------------------------------------------------\
  Generate HTML containers.
\------------------------------------------------------------------------------------------------*/

export function layout() {
    var wrapper = this.wrap
        .append('div')
        .attr('class', 'web-codebook')
            .append('div')
            .attr('class', 'table-wrapper');
    wrapper
        .append('div')
        .attr('class', 'controls');
    wrapper
        .append('div')
        .attr('class', 'summaryTable');
}
