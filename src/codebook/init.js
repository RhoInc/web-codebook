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
  this.loadingIndicator = this.wrap
    .insert('div', ':first-child')
    .attr('id', 'loading-indicator')
    .style('display', 'none');
  this.layout();
  var codebook = this;
  var layoutPromise = new Promise(function(resolve, reject) {
      if (codebook.wrap.size() === 1) {
          resolve('web-codebook layout succeeded');
          codebook.wrap.classed('loading', true);
          console.log(
          codebook.wrap
              .append('div')
              .attr('id', 'loading-indicator'));
      } else
          reject(Error('web-codebook layout failed'));
  });
  layoutPromise.then(function(result) {
    //prepare the data summaries
    codebook.data.makeSummary(codebook);
    codebook.util.makeAutomaticFilters(codebook);
    codebook.util.makeAutomaticGroups(codebook);

    //draw controls
    codebook.controls.init(codebook);

    //initialize nav, title and instructions
    codebook.title.init(codebook);
    codebook.nav.init(codebook);
    codebook.instructions.init(codebook);

    //call after event (if any)
    codebook.events.complete.call(codebook);

    //initialize and then draw the codebook
    codebook.summaryTable.draw(codebook);

    //initialize and then draw the data listing
    codebook.dataListing.init(codebook);

    var settingsPromise = new Promise(function(resolve, reject) {
        codebook.settings.init(codebook);
        if (codebook.settings.wrap.select('table').size() === 1) {
            resolve('web-codebook layout succeeded');
        } else
            reject(Error('web-codebook layout failed'));
    });
    settingsPromise.then(function(result) {
        console.log('web-codebook loaded!');
        codebook.wrap.classed('loading', false);
        codebook.wrap
            .select('#loading-indicator')
            .remove();
    }, (error) => {
        console.log('web-codebook failed :(');
    });
  }, (error) => {
      console.log(error);
  });
}
