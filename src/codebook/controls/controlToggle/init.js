/*------------------------------------------------------------------------------------------------\
  Initialize group controls.
\------------------------------------------------------------------------------------------------*/

export function init(codebook) {
  //render the control
  var controlToggle = codebook.controls.wrap
    .append('button')
    .attr('class', 'control-toggle');

  //set the initial
  codebook.controls.controlToggle.set(codebook)

  controlToggle.on('click', function() {
    console.log(d3.select(this).text())
    codebook.config.controlVisibility =
      d3.select(this).text() == "Hide" ?
      "minimized" : //click "-" to minimize controls
      "visible" // click "+" to show controls

    codebook.controls.controlToggle.set(codebook)
  });
}
