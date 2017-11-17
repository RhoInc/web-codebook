import { select as d3select } from 'd3';

export default function indicateLoading(codebook, element, callback) {
  console.log('loading: ' + element);
  codebook.statusWrap.selectAll('*').remove();
  codebook.loadingIndicator.style('display', 'block');
  //wait until the loading indicator is visible
  const loading = setInterval(() => {
    try {
      const laidOut = d3select(element).property('offsetwidth') > 0,
        displayNone = d3select(element).style('display') === 'none';

      //loading is complete
      if (!(laidOut && displayNone)) {
        if (callback) callback();
        clearInterval(loading);
        codebook.loadingIndicator.style('display', 'none');
        d3select('#loading-text').remove();
      }
    } catch (err) {
      clearInterval(loading);
      codebook.loadingIndicator.style('display', 'none');
      d3select('#loading-text').remove();

      codebook.statusWrap
        .append('div')
        .attr('class', 'status error')
        .html('There was a problem updating the chart:<br>' + err);

      console.warn(err);
    }
  }, 25);
}
