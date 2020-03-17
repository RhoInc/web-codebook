export function makeFiltered(data, filters) {
    let filtered = data;
    filters.forEach(filter => {
        filtered = filtered.filter(d => {
            const currentValues = filter.values
                .filter(f => f.selected)
                .map(m => m.value);
            return currentValues.includes(d[filter.value_col].toString());
        });
    });

    return filtered;
}
