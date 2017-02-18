export function init(chart) {
    chart.controls.wrap.attr('onsubmit', 'return false;');
    chart.controls.wrap.selectAll('*').remove();  //Clear controls.

  //Draw filters
    chart.controls.filters.init(chart);
}


