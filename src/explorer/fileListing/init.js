import { createTable } from 'webcharts';
import { onDraw } from './onDraw';
export function init(explorer) {
  var fileWrap = explorer.codebook.fileListing.wrap;
  fileWrap.selectAll('*').remove(); //Clear controls.

  //Make file selector
  var file_select_wrap = fileWrap
    .append('div')
    .classed('listing-container', true);

  explorer.codebook.fileListing.table = createTable(
    '.web-codebook .fileListing .listing-container',
    {}
  );

  onDraw(explorer);
  explorer.codebook.fileListing.table.init(explorer.config.files);

  /*
  select.on('change', function(d) {
    var current_text = this.value;
    var current_obj = explorer.config.files.filter(
      f => f.label == current_text
    )[0];
    explorer.makeCodebook(explorer, current_obj);
  })
  */
}
