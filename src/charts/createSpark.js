import makeLine from './spark/makeLine';
import makeHist from './spark/makeHist';

export default function createSpark() {
  var d = d3.select(this).datum();
  if (d.statistics.n > 0) {
    if (d.type === 'categorical') {
      makeHist(this, d);
    } else if (d.type === 'continuous') {
      makeLine(this, d);
    } else {
      console.warn('Invalid chart type for ' + d.key);
    }
  }
}
