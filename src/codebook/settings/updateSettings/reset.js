import indicateLoading from '../../util/indicateLoading';

export default function reset(codebook) {
  indicateLoading(codebook, '.web-codebook .dataListing .wc-chart', () => {
    //remove grouping and select 'None' group option
    delete codebook.config.group;
    codebook.controls.groups.update(codebook);
    codebook.controls.wrap
      .select('.group-select')
      .selectAll('option')
      .property('selected', d => d.value_col === 'None');

    //remove filtering and select all filter options
    codebook.data.highlighted = [];
    codebook.data.filtered = codebook.data.raw;
    codebook.controls.filters.update(codebook);
    codebook.controls.wrap
      .selectAll('.filterCustom option')
      .property('selected', true);

    //redraw data summary, codebook, and listing.
    codebook.data.makeSummary(codebook);
    codebook.title.updateCountSummary(codebook);
    codebook.summaryTable.draw(codebook);
    codebook.dataListing.init(codebook);
    codebook.chartMaker.init(codebook);
  });
}
