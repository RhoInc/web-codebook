import { createTable } from 'webcharts';
import { onDraw } from './onDraw';
export function init() {
  var explorer = this;

  var fileWrap = explorer.codebook.fileListing.wrap;
  fileWrap.selectAll('*').remove(); //Clear controls.

  //Make file selector
  var file_select_wrap = fileWrap
    .append('div')
    .classed('listing-container', true);

  //Create the table
  explorer.codebook.fileListing.table = createTable(
    '.web-codebook .fileListing .listing-container',
    explorer.config.tableConfig
  );

  //show the selected file first
  explorer.config.files.forEach(d => (d.selected = d == explorer.current));
  var sortedFiles = explorer.config.files.sort(function(a, b) {
    return a.selected ? -1 : b.selected ? 1 : 0;
  });

  //assign callbacks and initialize
  onDraw.call(explorer);
  explorer.codebook.fileListing.table.init(sortedFiles);
}
