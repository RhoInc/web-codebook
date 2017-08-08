import { select as d3select } from 'd3';

export default function indicateLoading(codebook, callback) {
    const
        loadingIndicator = codebook.wrap
            .select('#loading-indicator')
            .style('display', 'block');
    codebook.wrap.classed('loading', true);

  //wait by the centisecond until the loading indicator is visible
  const loading = setInterval(() => {
    const
        laidOut = loadingIndicator
            .property('offsetwidth') > 0;
    console.log(codebook.wrap.style('cursor'));

    if (!laidOut) {
        if (callback)
          callback();
      //loading is complete
      clearInterval(loading);
      loadingIndicator.style('display', 'none');
      codebook.wrap.classed('loading', false);
    }
  }, 100);
}
