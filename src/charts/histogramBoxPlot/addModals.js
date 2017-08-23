import { mouse as d3mouse } from 'd3';

export default function addModals(chart) {
  const bars = chart.svg.selectAll('.bar-group');
  const tooltips = chart.svg.selectAll('.svg-tooltip');
  const statistics = chart.svg.selectAll('.statistic');
  chart.svg
    .on('mousemove', function() {
      //Highlight closest bar.
      const mouse = d3mouse(this);
      const x = chart.x.invert(mouse[0]);
      const y = chart.y.invert(mouse[1]);
      let minimum;
      let bar = {};
      bars.each(function(d, i) {
        d.distance = Math.abs(d.midpoint - x);
        if (i === 0 || d.distance < minimum) {
          minimum = d.distance;
          bar = d;
        }
      });
      const closest = bars
        .filter(d => d.distance === minimum)
        .filter((d, i) => i === 0)
        .select('rect');
      bars.select('rect').style('stroke-width', '1px');
      closest.style('stroke-width', '3px');

      //Activate tooltip.
      const d = closest.datum();
      tooltips.classed('active', false);
      chart.svg.select('#' + d.selector).classed('active', true);
    })
    .on('mouseout', function() {
      bars.select('rect').style('stroke-width', '1px');
      chart.svg.selectAll('g.svg-tooltip').classed('active', false);
    });
}
