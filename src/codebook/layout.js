/*------------------------------------------------------------------------------------------------\
  Generate HTML containers.
\------------------------------------------------------------------------------------------------*/

export function layout() {
  this.title.wrap = this.wrap.append('div').attr('class', 'title section');
  this.nav.wrap = this.wrap.append('div').attr('class', 'nav section');
  this.controls.wrap = this.wrap
    .append('div')
    .attr('class', 'controls section');
  this.instructions.wrap = this.wrap
    .append('div')
    .attr('class', 'instructions section');
  this.summaryTable.wrap = this.wrap
    .append('div')
    .attr('class', 'summaryTable section')
    .classed('hidden', false);

  this.summaryTable.summaryText = this.summaryTable.wrap
    .append('strong')
    .attr('class', 'summaryText section');

  this.dataListing.wrap = this.wrap
    .append('div')
    .attr('class', 'dataListing section')
    .classed('hidden', true);

  this.settings.wrap = this.wrap
    .append('div')
    .attr('class', 'settings section')
    .classed('hidden', true);
}
