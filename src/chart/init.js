/*------------------------------------------------------------------------------------------------\
  Initialize codebook
\------------------------------------------------------------------------------------------------*/

export function init(data) {
    var settings = this.config;

    //create chart wrapper in specified div
    this.wrap = d3.select(this.element).append('div');
    this.wrap.attr("class","web-codebook")

    //save raw data
    this.raw_data = data; 

     //settings and defaults
    this.util.setDefaults(this)
    this.layout();

    //prepare the data summaries

    //stub a data summary 
    this.summary_data = [
        {value_col:"sex"},
        {value_col:"race"},
        {value_col:"age"}
    ]

    //draw controls

    //initialize and then draw the codebook
    this.summaryTable.init()
    this.summaryTable.draw(this)

}
