import moveYaxis from './moveYaxis';
import drawOverallMark from './drawOverallMark';
import modifyOverallLegendMark from './modifyOverallLegendMark';

export default function onResize() {
    moveYaxis(this);
    drawOverallMark(this);
    if (this.config.color_by)
        modifyOverallLegendMark(this);

    //Hide overall dots.
    if (this.config.color_by)
        this.svg
            .selectAll('.Overall')
            .remove();
    else
        this.svg
            .selectAll('.point')
            .remove();
}
