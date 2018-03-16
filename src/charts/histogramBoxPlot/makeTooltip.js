import { format as d3format } from 'd3';

export default function makeTooltip(d, i, context) {
  const format = d3format(context.config.measureFormat),
    offset = context.plot_width / context.config.x.bin / 2 + 8;
  d.midpoint = (d.rangeHigh + d.rangeLow) / 2;
  d.range = `${format(d.rangeLow)}-${format(d.rangeHigh)}`;
  d.selector = `bar` + i;
  d.side = context.x(d.midpoint) < context.plot_width / 2 ? 'left' : 'right';
  d.xPosition =
    d.side === 'left'
      ? context.x(d.midpoint) + offset
      : context.x(d.midpoint) - offset;

  //Define tooltips.
  const tooltip = context.svg.append('g').attr('id', d.selector),
    text = tooltip.append('text').attr({
      id: 'text',
      x: d.xPosition,
      y: context.plot_height,
      dy: '-.75em',
      'font-size': '75%',
      'font-weight': 'bold',
      fill: 'white'
    });
  text
    .append('tspan')
    .attr({
      x: d.xPosition,
      'text-anchor': d.side === 'left' ? 'start' : 'end'
    })
    .text(`Range: ${d.range}`);
  text
    .append('tspan')
    .attr({
      x: d.xPosition,
      dy: '-1.5em',
      'text-anchor': d.side === 'left' ? 'start' : 'end'
    })
    .text(`n: ${d.total}`);
  const dimensions = text[0][0].getBBox();
  tooltip.classed('svg-tooltip', true); //have to run after .getBBox() in FF/EI since this sets display:none

  const background = tooltip
    .append('rect')
    .attr({
      id: 'background',
      x: dimensions.x - 5,
      y: dimensions.y - 2,
      width: dimensions.width + 10,
      height: dimensions.height + 4
    })
    .style({
      fill: 'black',
      stroke: 'white'
    });
  tooltip[0][0].insertBefore(background[0][0], text[0][0]);
}
