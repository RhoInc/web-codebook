import { merge as d3merge } from 'd3';

export function initPanelSelect(codebook) {
  //X & Y Variables
  var panel_wrap = codebook.chartMaker.controlsWrap
    .append('span')
    .attr('class', 'control column-select panel');

  panel_wrap.append('small').html('panel variable: ');
  var panel_select = panel_wrap.append('select');

  var panelOptions = codebook.data.summary
    .filter(
      f =>
        codebook.config.groups.map(m => m.value_col).indexOf(f.value_col) >= 0
    )
    .filter(f => f.label != 'web-codebook-index');

  panelOptions.unshift({ label: 'No Panels' });

  var panel_items = panel_select
    .selectAll('option')
    .data(panelOptions)
    .enter()
    .append('option')
    .html(d => d.label);

  //Handlers for label events
  panel_select.on('change', function() {
    codebook.chartMaker.draw(codebook);
  });
}
