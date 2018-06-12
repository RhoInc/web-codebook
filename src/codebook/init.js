/*------------------------------------------------------------------------------------------------\
  Initialize codebook
\------------------------------------------------------------------------------------------------*/

import { select as d3select } from 'd3';
import clone from '../util/clone';
import indicateLoading from './util/indicateLoading';

export function init(data) {
  var settings = this.config;

  //create chart wrapper in specified div
  this.wrap = d3select(this.element)
    .append('div')
    .attr('class', 'web-codebook')
    .datum(this); // bind codebook object to codebook container so as to pass down to successive child elements

  // call the before callback (if any)
  this.events.init.call(this);

  //save raw data
  this.data.raw = clone(data);
  this.data.raw.forEach((d, i) => {
    d['web-codebook-index'] = i + 1; // define an index with which to identify records uniquely
  });
  this.data.filtered = this.data.raw; //assume no filters active on init :/
  this.data.highlighted = [];

  //settings and defaults
  this.util.setDefaults(this);
  this.layout();

  indicateLoading(this, '.web-codebook .settings', () => {
    //prepare the data summaries
    this.data.makeSummary(this);

    //make the title
    this.title.init(this);

    //draw controls
    this.util.makeAutomaticFilters(this);
    this.util.makeAutomaticGroups(this);
    this.controls.init(this);

    //initialize nav, title and instructions
    this.nav.init(this);
    this.instructions.init(this);

    //call after event (if any)
    this.events.complete.call(this);

    //initialize and then draw the codebook
    this.summaryTable.draw(this);

    //initialize and then draw the data listing
    this.dataListing.init(this);

    //initialize the chart maker
    this.chartMaker.init(this);

    //initialize the settings
    this.settings.init(this);
  });
}
