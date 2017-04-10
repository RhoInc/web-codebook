export default function moveYaxis(chart) {
    const
        ticks = chart.wrap.selectAll('g.y.axis g.tick');
        ticks.select('text').remove();
        ticks.append('title').text(d => d);
        ticks.append('text')
            .attr(
                {'text-anchor': 'start'
                ,'alignment-baseline': 'middle'
                ,'dx': '2.5em'
                ,'x': chart.plot_width})
            .text(d => d.length < 25
                ? d
                : d.substring(0,25)+'...');
}
