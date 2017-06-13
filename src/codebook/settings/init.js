export function init(codebook) {
    console.log(codebook);
  //Add control to update groups.
    const
        updateGroups = codebook.settings.wrap
            .append('div')
            .classed('update-groups update-control', true)
            .text('Select group variables:'),
        groupList = updateGroups
            .append('ul'),
        groupItems = groupList
            .selectAll('li')
                .data(Object.keys(codebook.data.raw[0]))
                .enter()
            .append('li');
    groupItems
        .each(function(d) {
            d3.select(this)
                .html(`<input type = "checkbox"> ${d}`);
            d3.select(this)
                .select('input')
                .property('checked', codebook.config.groups
                    .map(group => group.value_col).indexOf(d) > -1);
        });
    groupItems
        .each(function(d) {
            d3.select(this)
                .select('input')
                .on('click', function() {
                    d3.select(this).property('checked', !d3.select(this).property('checked'));
                });
        });
    groupItems
        .on('click', function() {
            const
                li = d3.select(this),
                input = li.select('input'),
                checked = input.property('checked');
            input.property('checked', !checked);
            const
                groups = groupItems
                    .filter(function() {
                        return d3.select(this).select('input').property('checked');
                    })
                    .data();
            codebook.config.groups = groups.map(d => { return {value_col: d}; });
            codebook.controls.groups.update(codebook);
        });

  //Add control to update filters.
    const
        updateFilters = codebook.settings.wrap
            .append('div')
            .classed('update-filters update-control', true)
            .text('Select filter variables:'),
        filterList = updateFilters
            .append('ul'),
        filterItems = filterList
            .selectAll('li')
                .data(Object.keys(codebook.data.raw[0]))
                .enter()
            .append('li');
    filterItems
        .each(function(d) {
            d3.select(this)
                .html(`<input type = "checkbox"> ${d}`);
            d3.select(this)
                .select('input')
                .property('checked', codebook.config.filters
                    .map(filter => filter.value_col).indexOf(d) > -1);
        });
    filterItems
        .each(function(d) {
            d3.select(this)
                .select('input')
                .on('click', function() {
                    d3.select(this).property('checked', !d3.select(this).property('checked'));
                });
        });
    filterItems
        .on('click', function() {
            const
                li = d3.select(this),
                input = li.select('input'),
                checked = input.property('checked');
            input.property('checked', !checked);
            const
                filters = filterItems
                    .filter(function() {
                        return d3.select(this).select('input').property('checked');
                    })
                    .data();
            codebook.config.filters = filters.map(d => { return {value_col: d}; });
            codebook.controls.filters.init(codebook);
        });
}
