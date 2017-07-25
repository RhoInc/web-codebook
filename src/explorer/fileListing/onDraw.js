import { select as d3select } from 'd3';

export function onDraw(explorer) {
  explorer.codebook.fileListing.table.on('draw', function() {
    //highlight the current row
    this.table
      .select('tbody')
      .selectAll('tr')
      .filter(f => f.raw == explorer.current)
      .classed('selected', true);

    //Linkify the labelColumn
    var labelCells = this.table
      .selectAll('td')
      .filter(f => f.col == explorer.config.labelColumn)
      .classed('link', true)
      .style('color', 'blue ')
      .style('text-decoration', 'underline')
      .style('cursor', 'pointer')
      .on('click', function() {
        var current_text = d3select(this).text();
        explorer.current = explorer.config.files.filter(
          f => f[explorer.config.labelColumn] == current_text
        )[0];
        explorer.current.event = 'click';
        explorer.makeCodebook(explorer);
      });
  });
}
