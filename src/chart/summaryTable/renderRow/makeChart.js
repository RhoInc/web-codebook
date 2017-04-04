import { makeDotPlot } from './makeDotPlot.js'
import { makeHistogram } from './makeHistogram.js'

export default function makeChart(d) {
  //Common chart settings
    this.height = 100;
    this.margin = {right:200, left:30};

    if (d.type === 'categorical') { // categorical outcomes
      makeDotPlot(this,d)
    } else { // continuous outcomes
      makeHistogram(this,d)
    }
}
