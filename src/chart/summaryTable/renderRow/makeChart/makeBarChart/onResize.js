import moveYaxis from './moveYaxis';
import drawOverallMark from './drawOverallMark';
import drawDifferences from './drawDifferences';

export default function onResize() {
    moveYaxis(this);
    drawOverallMark(this);
    if (this.config.group_col)
        drawDifferences(this);
}
