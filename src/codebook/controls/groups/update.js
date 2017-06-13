import { merge as d3merge } from 'd3';

export function update(codebook) {
    const
        groupControl = codebook.controls.wrap
            .select('div.group-select'),
        groupSelect = groupControl
            .select('select'),
        groupLevels = d3merge([
            ['None'],
            codebook.config.groups.map(m => m.value_col)
        ]);
    groupSelect
        .selectAll('option')
        .remove();
    groupSelect
        .selectAll('option')
            .data(groupLevels)
            .enter()
        .append('option')
        .text(d => d);
}
