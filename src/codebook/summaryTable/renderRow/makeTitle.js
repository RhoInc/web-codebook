import { select as d3select } from 'd3';

export default function makeTitle(d) {
  var rowDiv = d3select(this.parentNode.parentNode.parentNode);
  var chartDiv = rowDiv.select('.row-chart');
  var hiddenFlag = rowDiv.classed('hiddenChart');
  d3select(this)
    .append('div')
    .attr('class', 'row-toggle')
    .html(hiddenFlag ? '&#9660;' : '&#9658;')
    .classed('hidden', function(d) {
      return d.chartVisibility == 'hidden';
    })
    .on('click', function() {
      var rowDiv = d3select(this.parentNode.parentNode.parentNode);
      var chartDiv = rowDiv.select('.row-chart');
      var hiddenFlag = rowDiv.classed('hiddenChart');
      rowDiv.classed('hiddenChart', !hiddenFlag);
      d3select(this).html(hiddenFlag ? '&#9660;' : '&#9658;');
    });

  d3select(this)
    .append('span')
    .attr('class', 'title-span')
    .text(d => "'" + d.value_col + "'");

  if (d.value_col != d.label) {
    d3select(this)
      .append('span')
      .attr('class', 'label-span')
      .text(d => d.label);
  }
}
