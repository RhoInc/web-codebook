export default function layout(dataListing) {
  //Clear data listing.
  dataListing.wrap.selectAll('*:not(.clear-highlight)').remove();

  //Add sort container.
  const sortContainer = dataListing.wrap
    .append('div')
    .classed('sort-container', true);
  sortContainer
    .append('span')
    .classed('description', true)
    .text('Click any column header to sort that column.');

  //Add search container.
  const searchContainer = dataListing.wrap
    .append('div')
    .classed('search-container', true);
  searchContainer.append('span').classed('description', true).text('Search:');
  searchContainer.append('input').attr('class', 'search-box');

  //Add listing container.
  dataListing.wrap.append('div').classed('listing-container', true);

  //Add pagination container.
  const paginationContainer = dataListing.wrap
    .append('div')
    .classed('pagination-container', true);
  paginationContainer.append('span').classed('description', true).text('Page:');
}
