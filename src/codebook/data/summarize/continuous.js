import {
  format as d3format,
  mean as d3mean,
  deviation as d3deviation,
  quantile as d3quantile
} from "d3";

export default function continuous(vector) {
    const statistics = {};
    statistics.N = vector.length;
    const nonMissing = vector
        .filter(d => !isNaN(+d) && !/^\s*$/.test(d))
        .map(d => +d)
        .sort((a, b) => a - b);
    statistics.n = nonMissing.length;
    statistics.nMissing = vector.length - statistics.n;
    statistics.mean = d3format("0.2f")(d3mean(nonMissing));
    statistics.SD = d3format("0.2f")(d3deviation(nonMissing));
    const quantiles = [
            ["min", 0],
            ["5th percentile", 0.05],
            ["1st quartile", 0.25],
            ["median", 0.5],
            ["3rd quartile", 0.75],
            ["95th percentile", 0.95],
            ["max", 1]
        ];
    quantiles.forEach(quantile => {
        let statistic = quantile[0];
        statistics[statistic] = d3format("0.1f")(
            d3quantile(nonMissing, quantile[1])
        );
    });

    return statistics;
}
