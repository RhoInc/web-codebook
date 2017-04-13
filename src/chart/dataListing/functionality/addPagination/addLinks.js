import updatePagination from './updatePagination';

export default function addLinks(dataListing) {
  //Count rows.
    dataListing.pagination.rowsTotal = dataListing.codebook.data.filtered.length;

  //Calculate number of pages needed and create a link for each page.
    dataListing.pagination.numPages = Math.ceil(dataListing.pagination.rowsTotal/dataListing.pagination.rowsShown);
    dataListing.pagination.wrap.selectAll('a').remove();
    for (let i = 0; i < dataListing.pagination.numPages; i++) {
        dataListing.pagination.wrap
            .append('a')
            .datum({rel: i})
            .attr(
                {'href': '#'
                ,'rel': i})
            .text(i + 1);
    }
    dataListing.pagination.links = dataListing.pagination.wrap
        .selectAll('a');

  //Render first page.
    dataListing.pagination.activeLink = 0;
    //updatePagination(dataListing);
}
