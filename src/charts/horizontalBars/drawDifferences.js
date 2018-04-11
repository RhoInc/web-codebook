import { format as d3format, select as d3select } from 'd3';

export default function drawDifferences(chart) {
  //Clear difference marks and annotations.
  chart.svg.selectAll('.difference-from-total').remove();

  //For each mark draw a difference mark and annotation.
  chart.current_data
    .filter(function(d) {
      return d.values.raw[0].type == 'main';
    })
    .forEach(d => {
      const overall = chart.config.overall.filter(function(di) {
          return di.key === d.values.raw[0].key;
        })[0],
        g = chart.svg
          .append('g')
          .classed('difference-from-total', true)
          .style('display', 'none'),
        x = overall[chart.config.x.column],
        y = overall.key;

      //Draw line from overall rate to group rate.
      const diffLine = g
        .append('line')
        .attr({
          x1: chart.x(x),
          y1: chart.y(y) + chart.y.rangeBand() / 2,
          x2: chart.x(d.total),
          y2: chart.y(y) + chart.y.rangeBand() / 2
        })
        .style({
          stroke: 'black',
          'stroke-width': '2px',
          'stroke-opacity': '.25'
        });
      diffLine
        .append('title')
        .text(
          `Difference from overall rate: ${d3format('.1f')(
            (d.total - x) * 100
          )}`
        );
      const diffText = g
        .append('text')
        .attr({
          x: chart.x(d.total),
          y: chart.y(y) + chart.y.rangeBand() / 2,
          dx: x < d.total ? '5px' : '-2px',
          'text-anchor': x < d.total ? 'beginning' : 'end',
          'font-size': '0.7em'
        })
        .text(
          `${x < d.total ? '+' : x > d.total ? '-' : ''}${d3format('.1f')(
            Math.abs(d.total - x) * 100
          )}`
        );
    });

  //Display difference from total on hover.
  chart.svg
    .on('mouseover', () => {
      chart.svg.selectAll('.difference-from-total').style('display', 'block');
      chart.svg.selectAll('.difference-from-total text').each(function() {
        d3select(this).attr('dy', this.getBBox().height / 4);
      });
    })
    .on('mouseout', () =>
      chart.svg.selectAll('.difference-from-total').style('display', 'none')
    );
}
