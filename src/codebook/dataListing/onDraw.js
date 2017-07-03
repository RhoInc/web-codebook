import { select as d3select } from 'd3';
import addSort from './functionality/addSort';
import addSearch from './functionality/addSearch';
import addPagination from './functionality/addPagination';

export default function onDraw(dataListing) {
  dataListing.table.on('draw', function() {
    //Attach variable name rather than variable label to header to be able to apply settings.hiddenVariables to column headers.
    this.table.selectAll('th').attr('title', d => {
      const label = dataListing.config.variableLabels.filter(
        di => di.value_col === d
      )[0];
      return label ? label.label : null;
    });

    //Add header sort functionality.
    addSort(dataListing);

    //Add text search functionality.
    addSearch(dataListing);

    //Add pagination functionality.
    addPagination(dataListing);

    //Hide data listing columns corresponding to variables specified in settings.hiddenVariables.
    this.table
      .selectAll('th,td')
      .classed(
        'hidden',
        d => dataListing.config.hiddenVariables.indexOf(d.col ? d.col : d) > -1
      );
  });
}
