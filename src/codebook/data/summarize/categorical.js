import { nest as d3nest, format as d3format } from 'd3';

export default function categorical(vector) {
  const statistics = {};
  statistics.N = vector.length;
  const nonMissing = vector.filter(d => !/^\s*$/.test(d) && d !== 'NA');
  statistics.n = nonMissing.length;
  statistics.nMissing = vector.length - statistics.n;
  statistics.values = d3nest()
    .key(d => d)
    .rollup(d => {
      return {
        n: d.length,
        prop_N: d.length / statistics.N,
        prop_n: d.length / statistics.n,
        prop_N_text: d3format('0.1%')(d.length / statistics.N),
        prop_n_text: d3format('0.1%')(d.length / statistics.n)
      };
    })
    .entries(nonMissing);
  statistics.Unique = d3.set(vector).values().length;

  statistics.values.forEach(value => {
    for (var statistic in value.values) {
      value[statistic] = value.values[statistic];
    }
    delete value.values;
  });

  return statistics;
}
