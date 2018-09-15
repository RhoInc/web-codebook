import { select as d3select } from 'd3';

export function onDraw() {
  var explorer = this;

  explorer.codebook.fileListing.table.on('draw', function() {
    //highlight the current row
    this.table
      .select('tbody')
      .selectAll('tr')
      .classed('selected', f => f.fileID === explorer.current.fileID)

    //Linkify the labelColumn
    var labelCells = this.table
      .selectAll('tbody tr')
      .on('click', function(d) {
        explorer.current = d;
        explorer.current.event = 'click';
        explorer.makeCodebook(explorer);
      })
      .selectAll('td')
      .filter(f => f.col == explorer.config.labelColumn)
      .classed('link', true);
  });
}
