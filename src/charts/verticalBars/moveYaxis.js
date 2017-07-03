import { format as d3format } from 'd3';

export default function moveYaxis(chart) {
  const ticks = chart.wrap.selectAll('g.y.axis g.tick');
  ticks.select('text').remove();
  ticks.append('title').text(d => d);
  ticks
    .append('text')
    .attr({
      'text-anchor': 'start',
      'alignment-baseline': 'middle',
      dx: '.5em',
      x: chart.plot_width
    })
    .text(d => d3format(chart.config.y.format)(d));
}
