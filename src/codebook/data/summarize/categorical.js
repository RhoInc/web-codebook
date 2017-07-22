import { nest as d3nest, format as d3format, set as d3set } from 'd3';

export default function categorical(vector, sub) {
  const statistics = {};
  statistics.N = vector.length;
  const nonMissing = vector.filter(
    d => !/^\s*$/.test(d.value) && d.value !== 'NA'
  );
  statistics.n = nonMissing.length;
  statistics.nMissing = vector.length - statistics.n;
  statistics.values = d3nest()
    .key(d => d.value)
    .rollup(function(d) {
      var stats = {
        n: d.length,
        prop_N: d.length / statistics.N,
        prop_n: d.length / statistics.n,
        prop_N_text: d3format('0.1%')(d.length / statistics.N),
        prop_n_text: d3format('0.1%')(d.length / statistics.n),
        indexes: d.map(di => di.index)
      };
      if (sub) {
        var d_sub = d.filter(sub);
        stats.n_sub = d_sub.length;
        stats.prop_n_sub = d_sub.length / statistics.n;
        stats.prop_N_sub = d_sub.length / statistics.N;
        stats.prop_N_sub_text = d3format('0.1%')(d_sub.length / statistics.N);
        stats.prop_n_sub_text = d3format('0.1%')(d_sub.length / statistics.n);
      }
      return stats;
    })
    .entries(nonMissing);
  statistics.Unique = d3set(vector.map(d => d.value)).values().length;

  statistics.values.forEach(value => {
    for (var statistic in value.values) {
      value[statistic] = value.values[statistic];
    }
    delete value.values;
  });

  return statistics;
}
