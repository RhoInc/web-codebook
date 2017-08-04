import { select as d3select } from 'd3';

export default function indicateLoading(codebook, element, callback) {
    codebook.loadingIndicator.style('display', 'block');
  //wait by the centisecond until the loading indicator is visible
  const loading = setInterval(() => {
    const laidOut = d3.select(element).property('offsetwidth') > 0;
    if (!laidOut) {
        if (callback)
          callback();
      //loading is complete
      clearInterval(loading);
      codebook.loadingIndicator.style('display', 'none');
    }
  }, 100);
}
