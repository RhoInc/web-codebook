import {
  format as d3format,
  quantile as d3quantile,
  mean as d3mean,
  deviation as d3deviation,
  mouse as d3mouse
} from 'd3';
export default function addBoxPlot(chart) {
  const format = d3format(chart.config.measureFormat);

  //Annotate quantiles
  if (chart.config.boxPlot) {
    const quantiles = [
      { probability: 0.05, label: '5th percentile' },
      { probability: 0.25, label: '1st quartile' },
      { probability: 0.5, label: 'Median' },
      { probability: 0.75, label: '3rd quartile' },
      { probability: 0.95, label: '95th percentile' }
    ];

    for (const item in quantiles) {
      const quantile = quantiles[item];
      quantile.quantile = d3quantile(chart.values, quantile.probability);

      //Horizontal lines
      if ([0.05, 0.75].indexOf(quantile.probability) > -1) {
        const rProbability = quantiles[+item + 1].probability;
        const rQuantile = d3quantile(chart.values, rProbability);
        const whisker = chart.svg
          .append('line')
          .attr({
            class: 'statistic',
            x1: chart.x(quantile.quantile),
            y1: chart.plot_height + chart.config.boxPlotHeight / 2,
            x2: chart.x(rQuantile),
            y2: chart.plot_height + chart.config.boxPlotHeight / 2
          })
          .style({
            stroke: 'black',
            'stroke-width': '2px',
            opacity: 0.25
          });
        whisker
          .append('title')
          .text(
            `Q${quantile.probability}-Q${rProbability}: ${format(
              quantile.quantile
            )}-${format(rQuantile)}`
          );
      }

      //Box
      if (quantile.probability === 0.25) {
        const q3 = d3quantile(chart.values, 0.75);
        const interQ = chart.svg
          .append('rect')
          .attr({
            class: 'statistic',
            x: chart.x(quantile.quantile),
            y: chart.plot_height,
            width: chart.x(q3) - chart.x(quantile.quantile),
            height: chart.config.boxPlotHeight
          })
          .style({
            fill: '#ccc',
            opacity: 0.25
          });
        interQ
          .append('title')
          .text(
            `Interquartile range: ${format(quantile.quantile)}-${format(q3)}`
          );
      }

      //Vertical lines
      quantile.mark = chart.svg
        .append('line')
        .attr({
          class: 'statistic',
          x1: chart.x(quantile.quantile),
          y1: chart.plot_height,
          x2: chart.x(quantile.quantile),
          y2: chart.plot_height + chart.config.boxPlotHeight
        })
        .style({
          stroke: [0.05, 0.95].indexOf(quantile.probability) > -1
            ? 'black'
            : [0.25, 0.75].indexOf(quantile.probability) > -1
              ? 'black'
              : 'black',
          'stroke-width': '3px'
        });
      quantile.mark
        .append('title')
        .text(`${quantile.label}: ${format(quantile.quantile)}`);
    }

    var outliers = chart.values.filter(function(f) {
      var low_outlier =
        f <
        quantiles.filter(q => {
          if (q.probability == 0.05) {
            return q;
          }
        })[0]['quantile'];
      var high_outlier =
        f >
        quantiles.filter(q => {
          if (q.probability == 0.95) {
            return q;
          }
        })[0]['quantile'];
      return low_outlier || high_outlier;
    });

    // onlyUnique function removes duplicate outliers
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    var unique_outliers = outliers.filter(onlyUnique);

    var outlier = chart.svg
      .selectAll('line.outlier')
      .data(unique_outliers)
      .enter()
      .append('line')
      .attr('class', 'outlier')
      .attr('x1', d => chart.x(d))
      .attr('x2', d => chart.x(d))
      .attr('y1', d => chart.plot_height * 1.07)
      .attr('y2', d => (chart.plot_height + chart.config.boxPlotHeight) / 1.07)
      // 'index' attribute corresponds to the numerical index of the outliers
      // Added to ensure highlighting when outlier data is floating point (avoid selection based on
      //  data value with a decimal)
      .attr('index', function(d, i) {
        return i;
      })
      .attr('value', d => d)
      .style({
        fill: '#000000',
        stroke: 'black',
        'stroke-width': '1px'
      });
    outlier.append('title').text(function(d, i) {
      return d;
    });

    var bbox = chart.svg.node().getBBox();
    chart.svg
      .insert('rect', ':first-child')
      .attr('x', bbox.x)
      .attr('y', bbox.y)
      .attr('width', bbox.width)
      .attr('height', bbox.height)
      .style('fill', 'white');
  }

  //Annotate mean.
  if (chart.config.mean) {
    const mean = d3mean(chart.values);
    const sd = d3deviation(chart.values);
    const meanMark = chart.svg
      .append('circle')
      .attr({
        class: 'statistic',
        cx: chart.x(mean),
        cy: chart.plot_height + chart.config.boxPlotHeight / 2,
        r: chart.config.boxPlotHeight / 3
      })
      .style({
        fill: '#000000',
        stroke: 'black',
        'stroke-width': '1px'
      });
    meanMark
      .append('title')
      .text(
        `n: ${chart.values.length}\nMean: ${format(mean)}\nSD: ${format(sd)}`
      );
  }
}
