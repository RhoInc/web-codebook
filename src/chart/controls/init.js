export function init(chart) {
    chart.controls.wrap.attr('onsubmit', 'return false;');
    chart.controls.wrap.selectAll('*').remove();  //Clear controls.

  //Draw filters
    chart.controls.dataListingToggle.init(chart);
    chart.controls.groups.init(chart)
    chart.controls.chartToggle.init(chart);
    chart.controls.filters.init(chart);
}
