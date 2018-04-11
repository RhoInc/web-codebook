import { select as d3select } from 'd3';
import { format as d3format } from 'd3';

export default function makeTitle(d) {
  var rowDiv = d3select(this.parentNode.parentNode.parentNode);
  var chartDiv = rowDiv.select('.row-chart');
  var hiddenFlag = rowDiv.classed('hiddenDetails');
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
      var hiddenFlag = rowDiv.classed('hiddenDetails');
      rowDiv.classed('hiddenDetails', !hiddenFlag);
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

  d3select(this)
    .append('span')
    .attr('class', 'type')
    .text(d => d.type);

  d3select(this)
    .append('span')
    .attr('class', 'percent-missing')
    .text(d => d3format('0.1%')(d.statistics.percentMissing) + ' missing')
    .style('display', d => (d.statistics.percentMissing == 0 ? 'none' : null))
    .style('cursor', 'pointer')
    .style('color', d => (d.statistics.percentMissing >= 0.1 ? 'red' : '#999'))
    .attr(
      'title',
      d => d.statistics.nMissing + ' of ' + d.statistics.N + ' missing'
    );
}
