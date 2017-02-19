/*------------------------------------------------------------------------------------------------\
  Initialize explorer
\------------------------------------------------------------------------------------------------*/

export function init() {
    var settings = this.config;

    //create wrapper in specified div
    this.wrap = d3.select(this.element).append('div').attr("class","web-codebook-explorer")

    //layout the divs
    this.layout(this)

    //draw controls
    this.controls.init(this)
}
