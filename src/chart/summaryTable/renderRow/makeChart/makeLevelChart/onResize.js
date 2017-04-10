
import drawOverallMark from './drawOverallMark';
import drawDifferences from './drawDifferences';

export default function onResize() {
  //remove x-axis text
  var ticks = this.wrap.selectAll('g.x.axis g.tick');
  ticks.select("text").remove()

}
