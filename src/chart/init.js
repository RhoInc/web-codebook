/*------------------------------------------------------------------------------------------------\
  Initialize codebook
\------------------------------------------------------------------------------------------------*/

export function init(data) {
    var settings = this.config;

    //create chart wrapper in specified div
    this.wrap = d3.select(this.element).append('div').attr("class","web-codebook")

    //save raw data
    this.data.raw = data; 

     //settings and defaults
    this.util.setDefaults(this)
    this.layout();

    //prepare the data summaries
    this.data.summary = this.data.makeSummary(data)

    //draw controls

    //initialize and then draw the codebook
   // this.summaryTable.init()
    this.summaryTable.draw(this)

}
