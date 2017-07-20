/*------------------------------------------------------------------------------------------------\
  Initialize codebook
\------------------------------------------------------------------------------------------------*/

import { select as d3select } from 'd3';

export function init(data) {
  var settings = this.config;

  //create chart wrapper in specified div
  this.wrap = d3select(this.element)
    .append('div')
    .attr('class', 'web-codebook');

  // call the before callback (if any)
  this.events.init.call(this);

  //save raw data
  this.data.raw = data;
  this.data.filtered = data; //assume no filters active on init :/

  //settings and defaults
  this.util.setDefaults(this);
  this.layout();

  //prepare the data summaries
  this.data.makeSummary(this);

  //draw controls
  this.util.makeAutomaticFilters(this);
  this.util.makeAutomaticGroups(this);
  this.controls.init(this);

  //initialize nav, title and instructions
  this.title.init(this);
  this.nav.init(this);
  this.instructions.init(this);

  //call after event (if any)
  this.events.complete.call(this);

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
