import { select as d3select } from 'd3';

export default function indicateLoading(codebook, event, callback) {
    let t0 = performance.now();
    // begin performance test

    // indicate loading
    const html = document.getElementsByTagName('html')[0];
    if (!html.classList.contains('wcb-wait')) html.className += ' wcb-wait';
    const body = document.body;
    if (!body.classList.contains('wcb-wait')) body.className += ' wcb-wait';
    codebook.loadingIndicator.classed('wcb-hidden', false);

    const loading = setInterval(() => {
        const loadingIndicated = codebook.loadingIndicator.style('display') !== 'none';

        if (loadingIndicated) {
            // Run callback.
            if (callback) callback();

            // Handle loading indicator.
            clearInterval(loading);
            codebook.loadingIndicator.classed('wcb-hidden', true);
            html.className = html.className.replace(' wcb-wait', '');
            body.className = body.className.replace(' wcb-wait', '');

            // end performance test
            let t1 = performance.now();
            console.log(`${event} took ${t1 - t0} milliseconds.`);
        }
    });
    //codebook.statusWrap.selectAll('*').remove();
    //codebook.loadingIndicator.style('display', 'block');
    ////wait until the loading indicator is visible
    //const loading = setInterval(() => {
    //    try {
    //        const laidOut = d3select(element).property('offsetwidth') > 0,
    //            displayNone = d3select(element).style('display') === 'none';

    //        //loading is complete
    //        if (!(laidOut && displayNone)) {
    //            if (callback) callback();
    //            clearInterval(loading);
    //            codebook.loadingIndicator.style('display', 'none');
    //            d3select('#loading-text').remove();
    //        }
    //    } catch (err) {
    //        clearInterval(loading);
    //        codebook.loadingIndicator.style('display', 'none');
    //        d3select('#loading-text').remove();

    //        codebook.statusWrap
    //            .append('div')
    //            .attr('class', 'status error')
    //            .html('There was a problem updating the chart:<br>' + err);

    //        console.warn(err);
    //    }
    //}, 25);
}
