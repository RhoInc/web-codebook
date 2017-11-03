export function set(codebook) {
  //update toggle text
  codebook.controls.wrap
    .select('button.control-toggle')
    .text(codebook.config.controlVisibility == 'visible' ? 'Hide' : 'Show');
  codebook.controls.wrap.attr(
    'class',
    'controls section ' + codebook.config.controlVisibility
  );

  //hide the controls if controlVisibility isn't "visible" ...
  codebook.controls.wrap
    .selectAll('div')
    .classed('wc-hidden', !(codebook.config.controlVisibility == 'visible'));

  // but show the title and the toggle ...
  codebook.controls.wrap.select('div.controls-title').classed('wc-hidden', false);
  codebook.controls.wrap
    .select('button.control-toggle')
    .classed('wc-hidden', false);

  // unless control visibility is hidden, in which case just hide it all
  codebook.controls.wrap.classed(
    'wc-hidden',
    codebook.config.controlVisibility == 'wc-hidden' ||
      codebook.config.controlVisibility == 'disabled'
  );
}
