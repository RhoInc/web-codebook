import { select as d3select } from 'd3';

export function layout() {
    // create chart wrapper in specified div
    this.wrap = d3select(this.element)
        .append('div')
        .attr('class', 'web-codebook')
        .datum(this); // bind codebook object to codebook container so as to pass down to successive child elements

    this.loadingIndicator = this.wrap
        .append('div')
        .classed('wcb-hidden', true)
        .attr('id', 'loading-indicator');

    this.loadingIndicator.append('div').classed('spinner', true);

    this.statusWrap = this.wrap
        .append('div')
        .attr('class', 'statusWrap section');
    this.title.wrap = this.wrap.append('div').attr('class', 'title section');
    this.nav.wrap = this.wrap.append('div').attr('class', 'wcb-nav section');
    this.controls.wrap = this.wrap
        .append('div')
        .attr('class', 'controls section');
    this.instructions.wrap = this.wrap
        .append('div')
        .attr('class', 'instructions section');
    this.summaryTable.wrap = this.wrap
        .append('div')
        .attr('class', 'summaryTable section')
        .classed('hidden', false);

    this.summaryTable.summaryText = this.summaryTable.wrap
        .append('strong')
        .attr('class', 'summaryText section');

    this.fileListing = {};
    this.fileListing.wrap = this.wrap
        .append('div')
        .attr('class', 'fileListing section')
        .classed('hidden', true);

    this.dataListing.wrap = this.wrap
        .append('div')
        .attr('class', 'dataListing section')
        .classed('hidden', true);

    this.chartMaker.wrap = this.wrap
        .append('div')
        .attr('class', 'chartMaker section')
        .classed('hidden', true);

    this.settings.wrap = this.wrap
        .append('div')
        .attr('class', 'settings section')
        .classed('hidden', true);
}
