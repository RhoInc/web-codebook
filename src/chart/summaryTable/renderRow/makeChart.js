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

    if (d.type === 'categorical') { // categorical outcomes
      console.log(d)
      if(d.statistics.values.length <= 5){
        makeBarChartControls(this,d);
        makeBarChart(this,d)
      } else {
        makeLevelChartControls(this,d);
        makeLevelChart(this,d);
      }
    } else { // continuous outcomes
      makeHistogram(this,d)
    }
}
