import moveYaxis from './moveYaxis';
import drawOverallMark from './drawOverallMark';
import drawDifferences from './drawDifferences';
import highlightData from '../util/highlightData.js';

export default function onResize() {
  const
    context = this;

  moveYaxis(this);
  if (this.config.x.column === 'prop_n') {
    drawOverallMark(this);

    if (this.config.group_col) drawDifferences(this);
  }

  //Add event listener to marks to highlight data.
    highlightData(this);
}
