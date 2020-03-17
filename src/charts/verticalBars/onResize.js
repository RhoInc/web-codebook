import moveYaxis from './moveYaxis';
import makeTooltip from './makeTooltip.js';
import { mouse as d3mouse } from 'd3';
import highlightData from '../util/highlightData.js';

export default function onResize() {
    const context = this;

    moveYaxis(this);
    //remove x-axis text
    var ticks = this.wrap.selectAll('g.x.axis g.tick');
    ticks.select('text').remove();
    this.svg.selectAll('g.bar-group').each(function(d, i) {
        makeTooltip(d, i, context);
    });

    //Add modal to nearest mark.
    const bars = this.svg.selectAll('.bar-group:not(.sub)');
    const tooltips = this.svg.selectAll('.svg-tooltip');
    const statistics = this.svg.selectAll('.statistic');

    this.svg
        .on('mousemove', function() {
            //Highlight closest bar.
            const mouse = d3mouse(this);
            const x = mouse[0];
            const y = mouse[1];
            let minimum;
            let bar = {};
            bars.each(function(d, i) {
                d.distance = Math.abs(context.x(d.values.x) - x);
                if (i === 0 || d.distance < minimum) {
                    minimum = d.distance;
                    bar = d;
                }
            });

            //In the instance of equally close bars, e.g. an unhighlighted and highlighted bar, choose one randomly.
            let closest = bars.filter(d => d.distance === minimum);
            if (closest.size() > 1) {
                let arbitrary;
                closest = closest.filter((d, i) => {
                    if (i === 0) arbitrary = Math.round(Math.random());
                    return i === arbitrary;
                });
            }
            bars.select('rect')
                .style('stroke-width', null)
                .style('stroke', null);
            closest = closest.select('rect');

            //Activate tooltip.
            const d = closest.datum();
            tooltips.classed('active', false);
            context.svg.select('#' + d.selector).classed('active', true);

            closest.style('stroke-width', '3px').style('stroke', 'black');
        })
        .on('mouseout', function() {
            context.svg.selectAll('g.svg-tooltip').classed('active', false);
            bars.select('rect')
                .style('stroke-width', null)
                .style('stroke', null);
        });

    //Add event listener to marks to highlight data.
    highlightData(this);

    //hide legend
    this.legend.remove();
}
