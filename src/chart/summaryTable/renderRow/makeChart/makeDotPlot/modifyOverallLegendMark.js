export default function modifyOverallLegendMark(chart) {
    const
        legendItems = chart.wrap
            .selectAll('.legend-item'),
        overallMark = legendItems
            .filter(d => d.label === 'Overall')
            .select('svg'),
        BBox = overallMark.node().getBBox();
        overallMark.select('.legend-mark').remove();
        overallMark
            .append('line')
            .classed('legend-mark', true)
            .attr(
                {'x1': 3*BBox.width/4
                ,'y1': 0
                ,'x2': 3*BBox.width/4
                ,'y2': BBox.height})
            .style(
                {'stroke': 'black'
                ,'stroke-width': '2px'
                ,'stroke-opacity': '1'});
        legendItems
            .selectAll('circle')
            .attr('r', '.4em');
}
