import { makeDotPlot } from './makeChart/makeDotPlot.js'
import { makeBarChart } from './makeChart/makeBarChart.js'
import makeBarChartControls from './makeChart/makeBarChartControls.js'
import { makeLevelChart } from './makeChart/makeLevelChart.js'
import makeLevelChartControls from './makeChart/makeLevelChartControls.js'
import { makeHistogram } from './makeChart/makeHistogram.js'

export default function makeChart(d) {
  //Common chart settings
    this.height = 100;
    this.margin = {right:200, left:30};

    if (d.chartType === 'barChart') {
      makeBarChartControls(this,d);
      makeBarChart(this,d)
    } else  if(d.chartType === 'levelChart'){
      makeLevelChartControls(this,d);
      makeLevelChart(this,d);
    } else if(d.chartType === 'histogram'){ // continuous outcomes
      makeHistogram(this,d)
    } else {
      console.warn('Invalid chart type for '+d.key)
    }
}
