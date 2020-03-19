import makeTooltip from './makeTooltip';
import moveYaxis from './moveYaxis';
import moveXaxis from './moveXaxis';
import highlightData from '../util/highlightData.js';
import addHighlightMarks from './addHighlightMarks.js';
import addBoxPlot from './addBoxPlot.js';
import addModals from './addModals.js';

export default function onResize() {
    const context = this;
    console.log(this);

    //Hide overall plot if [settings.overall] is set to false.
    if (!this.config.overall && !this.group) {
        this.wrap.style('display', 'none');
        this.wrap.classed('overall', true);
    } else {
        //Clear custom marks.
        this.svg.selectAll('g.svg-tooltip').remove();
        this.svg.selectAll('.statistic').remove();

        //Add boxPlot
        addBoxPlot(this);

        //Create tooltips
        this.svg.selectAll('g.bar-group').each(function(d, i) {
            makeTooltip(d, i, context);
        });

        this.svg.select('g.y.axis text.axis-title').remove(); //Remove y-axis label
        this.wrap.select('ul.legend').remove(); //Hide legends.
        moveXaxis(this); //Shift x-axis tick labels downward.
        addModals(this); //Add modal to nearest mark.
    }

    moveYaxis(this); //Move Y axis to the right
    highlightData(this); //Add event listener to marks to highlight data.
    addHighlightMarks(this); //add new rects for highlight marks (if any)
}
