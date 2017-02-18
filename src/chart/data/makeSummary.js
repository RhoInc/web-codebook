export function makeSummary(data) {

    function determineType(vector) {
        const numericValues = vector
            .filter(d => !isNaN(+d) && !/^\s*$/.test(d));

        return numericValues.length === vector.length && numericValues.length > 4
            ? 'continuous'
            : 'categorical';
    }

    const summarize = {

        categorical: function(vector) {
            const statistics = {};
            statistics.N = vector.length;
            const nonMissing = vector
                .filter(d => !/^\s*$/.test(d) && d !== 'NA');
            statistics.n = nonMissing.length;
            statistics.nMissing = vector.length - statistics.n;
            statistics.values = d3.nest()
                .key(d => d)
                .rollup(d => {
                    return {
                        n: d.length,
                        prop_N: d.length/statistics.N,
                        prop_n: d.length/statistics.n}; })
                .entries(nonMissing);

            statistics.values
                .forEach(value => {
                    for (var statistic in value.values) {
                        value[statistic] = value.values[statistic];
                    }
                    delete value.values;
                });

            return statistics;
        },

        continuous: function(vector) {
            const statistics = {};
            statistics.N = vector.length;
            const nonMissing = vector
                .filter(d => !isNaN(+d) && !/^\s*$/.test(d))
                .map(d => +d)
                .sort();
            statistics.n = nonMissing.length;
            statistics.nMissing = vector.length - statistics.n;
            statistics.mean = d3.format('0.2f')(d3.mean(nonMissing));
            statistics.SD = d3.format('0.2f')(d3.deviation(nonMissing));
            const quantiles =
                [   ['min', 0]
                ,   ['5th percentile', .05]
                ,   ['1st quartile', .25]
                ,   ['median', .5]
                ,   ['3rd quartile', .75]
                ,   ['95th percentile', .95]
                ,   ['max', 1]];
            quantiles
                .forEach(quantile => {
                    let statistic = quantile[0];
                    statistics[statistic] = d3.format('0.1f')(d3.quantile(nonMissing, quantile[1]))
                });

            return statistics;
        }

    }

    const variables = Object.keys(data[0]);

    variables
        .forEach((variable,i) => {
            variables[i] = {value_col: variable};
            variables[i].values = data
                .map(d => d[variable])
                .sort();
            variables[i].type = determineType(variables[i].values);

            if (variables[i].type === 'categorical')
                variables[i].statistics = summarize.categorical(variables[i].values);
            else
                variables[i].statistics = summarize.continuous(variables[i].values);
        });

    return variables;
}
