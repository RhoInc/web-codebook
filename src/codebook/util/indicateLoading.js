import { select as d3select } from 'd3';

export default function indicateLoading(codebook, callback) {
    const
        loadingIndicator = codebook.wrap
            .select('#loading-indicator')
            .style('display', 'block');

  //wait by the centisecond until the loading indicator is visible
  const loading = setInterval(() => {
    const
        laidOut = loadingIndicator
            .property('offsetwidth') > 0;

    if (!laidOut) {
        if (callback)
          callback();
      //loading is complete
      clearInterval(loading);
      loadingIndicator.style('display', 'none');
    }
  }, 100);
}
