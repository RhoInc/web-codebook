import { nest as d3nest, format as d3format, set as d3set } from 'd3';

export default function categorical(vector, sub) {
    const statistics = {};
    statistics.N = vector.length;
    const nonMissing = vector.filter(f => !f.missing);
    statistics.n = nonMissing.length;
    statistics.nMissing = vector.length - statistics.n;
    statistics.percentMissing = statistics.nMissing / statistics.N;
    statistics.missingSummary =
        statistics.nMissing +
        '/' +
        statistics.N +
        ' (' +
        d3format('0.1%')(statistics.percentMissing) +
        ')';
    statistics.values = d3nest()
        .key(d => d.value)
        .rollup(function(d) {
            const stats = {
                n: d.length,
                prop_N: d.length / statistics.N,
                prop_n: d.length / statistics.n,
                prop_N_text: d3format('0.1%')(d.length / statistics.N),
                prop_n_text: d3format('0.1%')(d.length / statistics.n),
                indexes: d.map(di => di.index)
            };
            return stats;
        })
        .entries(nonMissing)
        .map(d => {
            Object.assign(d, d.values)
            delete d.values;
            return d;
        });

    statistics.Unique = d3set(nonMissing.map(d => d.value)).values().length;

    //statistics.values.forEach(value => {
    //    for (const statistic in value.values) {
    //        value[statistic] = value.values[statistic];
    //    }
    //    delete value.values;
    //});

    if (sub) {
        statistics.highlightValues = d3nest()
            .key(d => d.value)
            .rollup(function(d) {
                const stats = {
                    n: d.length,
                    prop_N: d.length / statistics.N,
                    prop_n: d.length / statistics.n,
                    prop_N_text: d3format('0.1%')(d.length / statistics.N),
                    prop_n_text: d3format('0.1%')(d.length / statistics.n),
                    indexes: d.map(di => di.index)
                };
                return stats;
            })
            .entries(nonMissing.filter(sub))
            .map(d => {
                Object.assign(d, d.values)
                delete d.values;
                return d;
            });

        //statistics.highlightValues.forEach(value => {
        //    for (const statistic in value.values) {
        //        value[statistic] = value.values[statistic];
        //    }
        //    delete value.values;
        //});
    }

    return statistics;
}
