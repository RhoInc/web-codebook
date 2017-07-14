import { createTable } from 'webcharts';

export function init(explorer) {
  console.log(explorer);
  var fileWrap = explorer.codebook.fileListing.wrap;
  fileWrap.selectAll('*').remove(); //Clear controls.

  //Make file selector

  var file_select_wrap = fileWrap
    .append('div')
    .style('padding', '.5em')
    .style('border-bottom', '2px solid black');

  file_select_wrap.append('span').text('Pick a file: ');

  var select = file_select_wrap.append('select');

  select
    .selectAll('option')
    .data(explorer.config.files)
    .enter()
    .append('option')
    .text(function(d) {
      return d.label;
    });

  select.on('change', function(d) {
    var current_text = this.value;
    var current_obj = explorer.config.files.filter(
      f => f.label == current_text
    )[0];
    explorer.makeCodebook(explorer, current_obj);
  });
}
