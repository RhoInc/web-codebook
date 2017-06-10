export function set(codebook) {
  console.log(codebook.config.controlVisibility)
  //update toggle text
  codebook.controls.wrap.select("button.control-toggle").text(codebook.config.controlVisibility == "visible" ? "Hide" : "Show")
  codebook.controls.wrap.attr("class","controls "+codebook.config.controlVisibility)
  
  //hide the controls if controlVisibility isn't "visible" ...
  codebook.controls.wrap.selectAll("*").classed("hidden", !(codebook.config.controlVisibility == "visible"))


  // but show the title and the toggle ...
  codebook.controls.wrap.select("div.controls-title").classed("hidden",false)
  codebook.controls.wrap.select("button.control-toggle").classed("hidden",false)

  // unless control visibility is hidden, in which case just hide it all
  codebook.controls.wrap.classed("hidden", codebook.config.controlVisibility == "hidden")
}
