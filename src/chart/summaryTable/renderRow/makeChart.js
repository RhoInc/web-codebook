import { makeDotPlot } from './makeChart/makeDotPlot.js'
import { makeBarChart } from './makeChart/makeBarChart.js'
import { makeHistogram } from './makeChart/makeHistogram.js'

export default function makeChart(d) {
  //Common chart settings
    this.height = 100;
    this.margin = {right:200, left:30};

    if (d.type === 'categorical') { // categorical outcomes
      //makeDotPlot(this,d)
      makeBarChart(this,d)
    } else { // continuous outcomes
      makeHistogram(this,d)
    }
}
