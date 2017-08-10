import { mouse as d3mouse } from 'd3';

export default function addModals(chart) {
  const bars = chart.svg.selectAll('.bar-group');
  const oliers = chart.svg.selectAll('line.outlier');
  const tooltips = chart.svg.selectAll('.svg-tooltip');
  const boxplottooltips = chart.svg.selectAll('.svg-boxplottooltip');
  const statistics = chart.svg.selectAll('.statistic');
  chart.svg
    .on('mousemove', function() {
      //Highlight closest bar.
      const mouse = d3mouse(this);
      const x = chart.x.invert(mouse[0]);
      const y = chart.y.invert(mouse[1]);
      let boxplot_lines;

      statistics.each(function(e, i) {
        if (i === 0 || e < boxplot_lines) {
          boxplot_lines = e;
        }
      });
	  
      // If the mouse is outside the whiskers, but within the furthest outlier (inclusive)
      if (
        (x > boxplot_lines.statistics['95th percentile'] ||
          x < boxplot_lines.statistics['5th percentile']) &&
        (x > boxplot_lines.statistics['min'] &&
          x < boxplot_lines.statistics['max']) &&
        y < 0
      ) {
        let min_dist;
        let dist;
        let olier;
        // Calculate closest outlier to mouse
        oliers.each(function(e, i) {
          dist = Math.abs(e - x);
          if (i === 0 || dist < min_dist) {
            min_dist = dist;
            // Select outlier to highlight based on index rather than outlier value
            olier = i;
          }
        });

        oliers.style({
          fill: '#000000',
          stroke: 'black',
          'stroke-width': '1px'
        });

        const closestolier = oliers
          // Highlight closest outlier based on index selection
          .filter((d, i) => i === olier)
          .style({
            fill: '#ea1010',
            stroke: 'red',
            'stroke-width': '4px'
          });

        //Activate -x axis tooltip.
        const d = closestolier.datum();
        boxplottooltips.classed('active', false);

        var active_outlier = chart.svg
          .selectAll('g.svg-boxplottooltip')
          // Filter based on index
          .filter((d, i) => i === olier)
          .classed('active', true);
        } else {
          // If the mouse is between the whiskers, above the x axis, or outside
          //  the boxplot (Need a wider active highlight area (with regards to
          //  x-range) than 'on mouseout' provides)
          oliers.style({
            fill: '#000000',
            stroke: 'black',
            'stroke-width': '1px'
          });
          boxplottooltips.classed('active', false);
        }

		if (y > 0) {
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
	}
    })
    .on('mouseout', function() {
      const mouse = d3mouse(this);
      const x = chart.x.invert(mouse[0]);
      const y = chart.y.invert(mouse[1]);

      bars.select('rect').style('stroke-width', '1px');
        // Following lines are for ensuring de-highlighting of outliers when mouse exits
        //  boxplot space in the -x direction.  (Can't just do 'on mouseout' because then the highest
        //  and lowest outlier can't be selected for highlighting (triggers mouseout on highest/lowest outlier)
        let boxplot_lines;
        statistics.each(function(e, i) {
          if (i === 0 || e < boxplot_lines) {
            boxplot_lines = e;
          }
        });
		// INSTEAD DO BELOW OUTLIER MARKS______
		console.log("Y cutoff");
		console.log(chart.plot_height * 1.07);
        if (
          x >
            boxplot_lines.statistics['min'] &&
          x < boxplot_lines.statistics['max']
        ) {
          oliers.style({
            fill: '#000000',
            stroke: 'black',
            'stroke-width': '1px'
          });
		  chart.svg.selectAll('g.svg-boxplottooltip').classed('active', false);
        }
        chart.svg
          .selectAll('g.svg-tooltip')
         .classed('active', false);
    });
}
