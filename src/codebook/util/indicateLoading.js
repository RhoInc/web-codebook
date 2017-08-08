import { select as d3select } from 'd3';

export default function indicateLoading(codebook, element, callback) {
  console.log(codebook.width);
  codebook.loadingIndicator
    .style('display', 'block')
    .style('margin-left', `-${codebook.wrap.node().offsetWidth / 2}`);
  console.log(codebook.loadingIndicator.style('margin-left'));
  codebook.wrap.classed('loading', true);
  //wait by the centisecond until the loading indicator is visible
  const loading = setInterval(() => {
    const laidOut = d3.select(element).property('offsetwidth') > 0;
    if (!laidOut) {
      if (callback) callback();
      //loading is complete
      clearInterval(loading);
      codebook.loadingIndicator.style('display', 'none');
      codebook.wrap.classed('loading', false);
    }
  }, 100);
}
