/*------------------------------------------------------------------------------------------------\
  Initialize codebook
\------------------------------------------------------------------------------------------------*/

import { select as d3select } from 'd3';
import clone from '../util/clone';

export function init(data) {
  var settings = this.config;

  //create chart wrapper in specified div
  this.wrap = d3select(this.element)
    .append('div')
    .attr('class', 'web-codebook')
    .datum(this); // bind codebook object to codebook container so as to pass down to successive child elements

  //save raw data
  this.data.raw = clone(data);
  this.data.raw
    .forEach((d,i) => {
        d['web-codebook-index'] = i + 1; // define an index with which to identify records uniquely
    });
  this.data.filtered = this.data.raw; //assume no filters active on init :/
  this.data.highlighted = [];

  //settings and defaults
  this.util.setDefaults(this);
  this.layout();

  //initialize nav
  this.nav.init(this);

  //prepare the data summaries
  this.data.makeSummary(this);

  //draw controls
  this.util.makeAutomaticFilters(this);
  this.util.makeAutomaticGroups(this);
  this.controls.init(this);

  //wait by the quarter second until the loading indicator is visible
  const loading = setInterval(() => {
    const laidOut = this.controls.wrap.property('offsetwidth') > 0;
    if (!laidOut) {
      //initialize and then draw the codebook
      this.summaryTable.draw(this);

      //initialize and then draw the data listing
      this.dataListing.init(this);

      //initialize and then draw the data listing
      this.settings.init(this);

      //loading is complete
      clearInterval(loading);
      this.loadingIndicator.style('display', 'none');
    }
  }, 250);
}
