/*------------------------------------------------------------------------------------------------\
  Initialize codebook
\------------------------------------------------------------------------------------------------*/

export function init(data) {
  var settings = this.config;

  //create chart wrapper in specified div
  this.wrap = d3
    .select(this.element)
    .append("div")
    .attr("class", "web-codebook");

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

  //initialize and then draw the codebook
  this.summaryTable.draw(this);

  //initialize and then draw the data listing
  this.dataListing.init(this);
}
