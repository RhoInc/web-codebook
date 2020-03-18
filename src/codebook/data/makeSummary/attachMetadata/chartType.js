export default function chartType(codebook, variable) {
    let chartType = 'none';

    if (variable.type === 'continuous') {
        chartType = 'histogramBoxPlot';
    } else if (variable.type === 'categorical') {
        if (
            variable.statistics.values.length > codebook.config.maxLevels
        ) {
            chartType = 'character';
            variable.summaryText =
                'Character variable with ' +
                variable.statistics.values.length +
                ' unique levels.<br>' +
                "<span class='caution'><span class='drawLevel'>Click here</span> to treat this variable as categorical and draw a histogram with " +
                variable.statistics.values.length +
                ' levels. Note that this may slow down or crash your browser.</span>';
        } else if (
            variable.statistics.values.length > codebook.config.levelSplit
        ) {
            chartType = 'verticalBars';
        } else if (
            variable.statistics.values.length <=
            codebook.config.levelSplit
        ) {
            chartType = 'horizontalBars';
        }
    }

    return chartType;
}
