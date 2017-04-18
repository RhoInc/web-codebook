export function makeFiltered(data, filters) {
  var filtered = data;
  filters.forEach(function(filter_d) {
    //remove the filtered values from the data based on the filters
    filtered = filtered.filter(function(rowData) {
      var currentValues = filter_d.values
        .filter(f => f.selected)
        .map(m => m.value);
      return currentValues.indexOf(rowData[filter_d.value_col]) > -1;
    });
  });
  return filtered;
}
