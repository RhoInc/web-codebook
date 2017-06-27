import addLinks from './addPagination/addLinks';
import updatePagination from './addPagination/updatePagination';
import { select as d3select } from 'd3';

export default function addPagination(dataListing) {
  //Render page links.
  addLinks(dataListing);

  //Render a different page on click.
  dataListing.pagination.links.on('click', function() {
    dataListing.pagination.activeLink = d3select(this).attr('rel');
    updatePagination(dataListing);
  });
}
