import defaultSettings from '../../../../defaultSettings';

export default function calculateNumberOfBins(codebook, variable) {
    const IQR =
        +variable.statistics['3rd quartile'] -
        +variable.statistics['1st quartile'];
    const n = variable.statistics['n'];
    const range =
        +variable.statistics['max'] - +variable.statistics['min'];
    const binSize = 2 * (IQR / Math.pow(n, 1.0 / 3.0));
    const bins =
        binSize > 0
            ? Math.ceil(range / binSize)
            : codebook.config.nBins > 0
                ? codebook.config.nBins
                : defaultSettings.nBins;

    return bins;
}
