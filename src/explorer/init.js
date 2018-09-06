/*------------------------------------------------------------------------------------------------\
  Initialize explorer
\------------------------------------------------------------------------------------------------*/

import { select as d3select } from 'd3';
import { setDefaults } from './setDefaults';

export function init() {
  var explorer = this;
  var settings = this.config;

  //call the init callback
  this.events.init.call(this);

  //set the defailts
  setDefaults(this);

  //prepare to draw the codebook for the first file
  this.current = this.config.files[0];
  this.current.event = 'load';

  //create wrapper in specified div
  this.wrap = d3select(this.element)
    .append('div')
    .attr('class', 'web-codebook-explorer');

  //layout the divs
  this.layout(this);

  //draw first codebook
  this.makeCodebook(this);
}
