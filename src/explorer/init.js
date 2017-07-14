/*------------------------------------------------------------------------------------------------\
  Initialize explorer
\------------------------------------------------------------------------------------------------*/

import { select as d3select } from 'd3';

export function init() {
  var settings = this.config;
  //create wrapper in specified div
  this.wrap = d3select(this.element)
    .append('div')
    .attr('class', 'web-codebook-explorer');

  //layout the divs
  this.layout(this);

  //draw first codebook
  this.makeCodebook(this.config.files[0]);

  //draw controls
  this.controls.init(this);
}
