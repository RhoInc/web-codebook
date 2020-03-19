import {
    format as d3format,
    mean as d3mean,
    deviation as d3deviation,
    quantile as d3quantile
} from 'd3';

export default function continuous(vector, sub) {
    const statistics = {};

    // frequencies
    statistics.N = vector.length;
    const nonMissing = vector
        .map(scalar => +scalar)
        .filter(scalar => scalar !== undefined && scalar !== null && !isNaN(scalar))
        .sort((a, b) => a - b);
    statistics.n = nonMissing.length;
    statistics.nMissing = statistics.N - statistics.n;

    // rates
    statistics.percentMissing = statistics.nMissing / statistics.N;
    statistics.missingSummary =
        statistics.nMissing +
        '/' +
        statistics.N +
        ' (' +
        d3format('0.1%')(statistics.percentMissing) +
        ')';

    // descriptive
    statistics.mean = d3format('0.2f')(d3mean(nonMissing));
    statistics.SD = d3format('0.2f')(d3deviation(nonMissing));
    const quantiles = [
        ['min', 0],
        ['5th percentile', 0.05],
        ['1st quartile', 0.25],
        ['median', 0.5],
        ['3rd quartile', 0.75],
        ['95th percentile', 0.95],
        ['max', 1]
    ];
    quantiles.forEach(quantile => {
        const statistic = quantile[0];
        statistics[statistic] = d3format('0.1f')(
            d3quantile(nonMissing, quantile[1])
        );
    });

    if (sub) {
        const sub_vector = vector
            .filter(sub)
            .filter(scalar => scalar !== undefined && scalar !== null && !isNaN(scalar))
            .map(d => +d.value)
            .sort((a, b) => a - b);
        statistics.mean_sub = d3format('0.2f')(d3mean(sub_vector));
        statistics.SD_sub = d3format('0.2f')(d3deviation(sub_vector));
        quantiles.forEach(quantile => {
            let statistic = quantile[0];
            statistics[statistic + '_sub'] = d3format('0.1f')(
                d3quantile(sub_vector, quantile[1])
            );
        });
    }

    return statistics;
}
