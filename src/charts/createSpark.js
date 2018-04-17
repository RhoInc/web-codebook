import makeLine from './spark/makeLine';
import makeHist from './spark/makeHist';

export default function createSpark() {
  var d = d3.select(this).datum();
  if (d.statistics.n > 0) {
    makeHist(this, d);
  }
}
