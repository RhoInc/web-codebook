import { createHistogram } from '../../../createHistogram.js'

export function makeHistogram(this_, d){
  console.log(d.bins)
  const chartContainer = d3.select(this_).node();
  const chartSettings =
      {measure: ' '
      ,resizable: false
      ,height: 100
      ,margin: this_.margin
      ,nBins:d.bins};
  let chartData = [];

  if (d.groups) {
      chartSettings.panel = 'group';
      d.groups.forEach(group => {
          group.values.forEach(value => {
              chartData.push({group: group.group, ' ': value});
          });
      });
  } else {
      d.values.forEach(d => {
          chartData.push({' ': d});
      });
  }

  const chart = createHistogram(chartContainer, chartSettings);
  chart.init(chartData);
}
