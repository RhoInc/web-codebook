export function init(codebook) {
    codebook.controls.wrap.attr('onsubmit', 'return false;');
    codebook.controls.wrap.selectAll('*:not(#loading-indicator)').remove(); //Clear controls.

    //Draw title
    codebook.controls.title = codebook.controls.wrap
        .append('div')
        .attr('class', 'controls-title')
        .text('Controls');
    codebook.controls.summaryWrap = codebook.controls.title.append('span');
    codebook.controls.rowCount = codebook.controls.summaryWrap
        .append('span')
        .attr('class', 'rowCount');
    codebook.controls.highlightCount = codebook.controls.summaryWrap
        .append('span')
        .attr('class', 'highlightCount');

    //Draw controls.
    codebook.controls.groups.init(codebook);
    codebook.controls.filters.init(codebook);
    codebook.controls.controlToggle.init(codebook);
    codebook.controls.highlight.init(codebook);
    codebook.controls.updateRowCount(codebook);

    //Hide group-by options corresponding to variables specified in settings.hiddenVariables.
    codebook.controls.wrap
        .selectAll('.group-select option')
        .classed('hidden', d => codebook.config.hiddenVariables.indexOf(d) > -1);

    //Hide filters corresponding to variables specified in settings.hiddenVariables.
    codebook.controls.wrap
        .selectAll('.filter-list li.filterCustom')
        .classed(
        'hidden',
        d => codebook.config.hiddenVariables.indexOf(d.value_col) > -1
        );
}
