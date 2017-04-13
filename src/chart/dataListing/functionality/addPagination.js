import addLinks from './addPagination/addLinks';
import updatePagination from './addPagination/updatePagination';

export default function addPagination(dataListing) {
    dataListing.pagination = {};
    dataListing.pagination.wrap = dataListing.wrap
        .select('.pagination-container');
    dataListing.pagination.rowsShown = 25;

  //Render page links.
    addLinks(dataListing);

  //Render a different page on click.
    dataListing.pagination.links
        .on('click', function() {
            dataListing.pagination.activeLink = d3.select(this).attr('rel');
            updatePagination(dataListing);
        });
}
