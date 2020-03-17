import { format as d3format } from 'd3';

export default function makeTooltip(d, i, context) {
    const format = d3format(context.config.measureFormat);
    d.selector = `bar` + i;
    //Define tooltips.
    const tooltip = context.svg.append('g').attr('id', d.selector);
    const text = tooltip.append('text').attr({
        id: 'text',
        x: context.x(d.values.x),
        y: context.plot_height,
        dy: '-.75em',
        'font-size': '75%',
        'font-weight': 'bold',
        fill: 'white'
    });
    text.append('tspan')
        .attr({
            x: context.x(d.values.x),
            dx: context.x(d.values.x) < context.plot_width / 2 ? '1em' : '-1em',
            'text-anchor':
                context.x(d.values.x) < context.plot_width / 2 ? 'start' : 'end'
        })
        .text(`${d.values.x}`);
    text.append('tspan')
        .attr({
            x: context.x(d.values.x),
            dx: context.x(d.values.x) < context.plot_width / 2 ? '1em' : '-1em',
            dy: '-1.5em',
            'text-anchor':
                context.x(d.values.x) < context.plot_width / 2 ? 'start' : 'end'
        })
        .text(
            'n=' + d.values.raw[0].n + ' (' + d3format('0.1%')(d.total) + ')'
        );
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
