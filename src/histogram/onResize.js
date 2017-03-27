export default function onResize() {
    const context = this;
    const format = d3.format(this.config.measureFormat);

  //Hide overall plot if [settings.overall] is set to false.
    if (!this.config.overall && !this.group)
        this.wrap.style('display', 'none');
    else {
      //Clear custom marks.
        this.svg.selectAll('rect.wc-data-mark').style('display', 'none');
        this.svg.selectAll('line.spike').remove();
        this.svg.selectAll('g.tooltip').remove();
        this.svg.selectAll('.statistic').remove();

      //Replace rects with lines.
        this.svg
            .selectAll('g.bar-group')
            .each(function(d,i) {
              //Define spikes.
                d.midpoint = (d.rangeHigh + d.rangeLow)/2;
                d.range = `${format(d.rangeLow)}-${format(d.rangeHigh)}`;
                d.selector = `range${d.range.replace(/\./g, 'd').replace(',', '_')}`;
                const spike = d3.select(this)
                    .append('line')
                    .datum(d)
                    .attr(
                        {'class': 'spike'
                        ,'x1': context.x(d.midpoint)
                        ,'y1': context.plot_height
                        ,'x2': context.x(d.midpoint)
                        ,'y2': context.y(d.total)})
                    .style(
                        {'stroke': 'black'
                        ,'stroke-width': '3px'});

              //Define tooltips.
                const tooltip = context.svg
                    .append('g')
                    .classed('tooltip', true)
                    .attr('id', d.selector);
                const text = tooltip
                    .append('text')
                    .attr(
                        {'id': 'text'
                        ,'x': context.x(d.midpoint)
                        ,'y': context.plot_height
                        ,'dy': '-.75em'
                        ,'font-size': '75%'
                        ,'font-weight': 'bold'
                        ,'fill': 'white'});
                text.append('tspan')
                    .attr(
                        {'x': context.x(d.midpoint)
                        ,'dx': context.x(d.midpoint) < context.plot_width/2
                            ? '1em'
                            : '-1em'
                        ,'text-anchor': context.x(d.midpoint) < context.plot_width/2
                            ? 'start'
                            : 'end'})
                    .text(`Range: ${d.range}`);
                text.append('tspan')
                    .attr(
                        {'x': context.x(d.midpoint)
                        ,'dx': context.x(d.midpoint) < context.plot_width/2
                            ? '1em'
                            : '-1em'
                        ,'dy': '-1.5em'
                        ,'text-anchor': context.x(d.midpoint) < context.plot_width/2
                            ? 'start'
                            : 'end'})
                    .text(`n: ${d.total}`);
                const dimensions = text[0][0].getBBox();
                const background = tooltip
                    .append('rect')
                    .attr(
                        {'id': 'background'
                        ,'x': dimensions.x - 5
                        ,'y': dimensions.y - 2
                        ,'width': dimensions.width + 10
                        ,'height': dimensions.height + 4})
                    .style(
                        {'fill': 'black'
                        ,'stroke': 'white'});
                tooltip[0][0].insertBefore(background[0][0], text[0][0]);
            });

      //Annotate quantiles
        if (this.config.boxPlot) {
            const quantiles = [
                {probability: .05, label: '5th percentile'},
                {probability: .25, label: '1st quartile'},
                {probability: .50, label: 'Median'},
                {probability: .75, label: '3rd quartile'},
                {probability: .95, label: '95th percentile'}];

            for (const item in quantiles) {
                const quantile = quantiles[item];
                quantile.quantile = d3.quantile(this.values, quantile.probability);

              //Horizontal lines
                if ([.05, .75].indexOf(quantile.probability) > -1) {
                    const rProbability = quantiles[+item + 1].probability;
                    const rQuantile = d3.quantile(this.values, rProbability);
                    const whisker = this.svg
                        .append('line')
                        .attr(
                            {'class': 'statistic'
                            ,'x1': this.x(quantile.quantile)
                            ,'y1': this.plot_height + 4
                            ,'x2': this.x(rQuantile)
                            ,'y2': this.plot_height + 4})
                        .style(
                            {'stroke': 'red'
                            ,'stroke-width': '2px'
                            ,'opacity': .25});
                    whisker
                        .append('title')
                        .text(`Q${quantile.probability}-Q${rProbability}: ${format(quantile.quantile)}-${format(rQuantile)}`);
                }

              //Box
                if (quantile.probability === .25) {
                    const q3 = d3.quantile(this.values, .75);
                    const interQ = this.svg
                        .append('rect')
                        .attr(
                            {'class': 'statistic'
                            ,'x': this.x(quantile.quantile)
                            ,'y': this.plot_height
                            ,'width': this.x(q3) - this.x(quantile.quantile)
                            ,'height': 8})
                        .style(
                            {'fill': 'blue'
                            ,'opacity': .25});
                    interQ
                        .append('title')
                        .text(`Interquartile range: ${format(quantile.quantile)}-${format(q3)}`);
                }

              //Vertical lines
                quantile.mark = this.svg
                    .append('line')
                    .attr(
                        {'class': 'statistic'
                        ,'x1': this.x(quantile.quantile)
                        ,'y1': this.plot_height
                        ,'x2': this.x(quantile.quantile)
                        ,'y2': this.plot_height + 8})
                    .style(
                        {'stroke': [.05,.95].indexOf(quantile.probability) > -1
                            ? 'red'
                            : [.25,.75].indexOf(quantile.probability) > -1
                                ? 'blue'
                                : 'black'
                        ,'stroke-width': '3px'})
                quantile.mark
                    .append('title')
                    .text(`${quantile.label}: ${format(quantile.quantile)}`);
            }
        }

      //Annotate mean.
        if (this.config.mean) {
            const mean = d3.mean(this.values);
            const sd = d3.deviation(this.values);
            const meanMark = this.svg
                .append('circle')
                .attr(
                    {'class': 'statistic'
                    ,'cx': this.x(mean)
                    ,'cy': this.plot_height + 4
                    ,'r': 3})
                .style(
                    {'fill': '#ccc'
                    ,'stroke': 'black'
                    ,'stroke-width': '1px'})
            meanMark
                .append('title')
                .text(`n: ${this.values.length}\nMean: ${format(mean)}\nSD: ${format(sd)}`);
        }

      //Rotate y-axis labels.
        this.svg.select('g.y.axis text.axis-title').remove();
        this.svg.select('g.y.axis')
            .insert('text', ':first-child')
            .attr(
                {'class': 'axis-title'
                ,'x': 0
                ,'y': this.plot_height/2
                ,'dx': '-2.5em'})
            .style('text-anchor', 'end')
            .text(this.config.y.label);

      //Hide legends.
        this.wrap.select('ul.legend').remove();

      //Shift x-axis tick labels downward.
        this.svg.select('.x.axis').selectAll('g.tick text').attr('dy', '1em');

      //Add modal to nearest mark.
        const spikes = this.svg.selectAll('.spike');
        const tooltips = this.svg.selectAll('.tooltip');
        const statistics = this.svg.selectAll('.statistic');
        this.svg
            .on('mousemove', function() {
              //Highlight closest spike.
                const mouse = d3.mouse(this);
                const x = context.x.invert(mouse[0]);
                const y = context.y.invert(mouse[1]);
                let minimum;
                let spike = {};
                spikes
                    .style('stroke', 'black')
                    .each(function(d,i) {
                        d.distance = Math.abs(d.midpoint - x);
                        if (i === 0 || d.distance < minimum) {
                            minimum = d.distance;
                            spike = d;
                        }
                    });
                const closest = spikes
                    .filter(d => d.distance === minimum)
                    .filter((d,i) => i === 0)
                    .style('stroke', 'red');

              //Activate tooltip.
                const d = closest.datum();
                tooltips
                    .classed('active', false);
                context.svg
                    .select('#' + d.selector)
                    .classed('active', true)
            })
            .on('mouseout', function() {
                spikes
                    .style('stroke', 'black')
                tooltips
                    .classed('active', false);
            });
    }
}
