export function initAxisSelect(codebook) {
  //X & Y Variables
  var x_wrap = codebook.chartMaker.controlsWrap
    .append('span')
    .attr('class', 'control column-select x');

  var y_wrap = codebook.chartMaker.controlsWrap
    .append('span')
    .attr('class', 'control column-select y');

  x_wrap.append('small').html('x variable: ');
  y_wrap.append('small').html('y variable: ');

  var x_select = x_wrap.append('select');
  var y_select = y_wrap.append('select');

  var axisOptions = codebook.data.summary
    .filter(
      f =>
        f.type == 'continuous' ||
        codebook.config.groups.map(m => m.value_col).indexOf(f.value_col) >= 0
    )
    .filter(f => f.label != 'web-codebook-index');

  var x_items = x_select
    .selectAll('option')
    .data(axisOptions)
    .enter()
    .append('option')
    .property('selected', function(d, i) {
      return i == 0;
    })
    .html(d => d.label);

  var y_items = y_select
    .selectAll('option')
    .data(axisOptions)
    .enter()
    .append('option')
    .property('selected', function(d, i) {
      return i == 1;
    })
    .html(d => d.label);

  //Handlers for label events
  x_select.on('change', function() {
    codebook.chartMaker.draw(codebook);
  });

  y_select.on('change', function() {
    codebook.chartMaker.draw(codebook);
  });
}
