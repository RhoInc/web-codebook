import defineVariableArray from './makeSummary/defineVariableArray';
import attachMetadata from './makeSummary/attachMetadata';
import calculateStatistics from './makeSummary/calculateStatistics';
import chartType from './makeSummary/attachMetadata/chartType';
import bins from './makeSummary/attachMetadata/bins';
import summarizeGroups from './makeSummary/summarizeGroups';

export function makeSummary(codebook) {
    const t0 = performance.now();
    //begin performance test

    const summary = codebook.data.variables.map(variable => {
        const varObj = {
            value_col: variable,
            values: Array(codebook.data.filtered.length),
            statistics: {},

            // variable metadata
            metadata: {},
            hidden: null,
            chartVisibility: null,
            label: null,
            type: null,
            meta: null,
            chartType: null,
            bins: null,
        };

        return varObj;
    });

    const missingRegex = /^\s*$/;
    const numberRegex = /^-?[0-9]*\.?[0-9]*$/;
    for (let i = 0; i < codebook.data.filtered.length; i++) {
        const d = codebook.data.filtered[i];
        for (let j = 0; j < codebook.data.nVariables; j++) {
            const variable = codebook.data.variables[j];
            summary[j].values[i] = {};
            const datum = summary[j].values[i];
            datum.index = d['web-codebook-index'];
            datum.value = d[variable];
            datum.missing = (codebook.config.whiteSpaceMissing && missingRegex.test(datum.value)) || codebook.config.missingValues.includes(datum.value);
            datum.number = !datum.missing
                ? numberRegex.test(datum.value)
                : false;
            datum.string = !datum.missing && !datum.number;
            datum.highlighted = codebook.data.highlighted.includes(d);
        }
    }

    summary.forEach(variable => {
        variable.metadata = attachMetadata(codebook, variable);
        variable.statistics = calculateStatistics(codebook, variable);
        variable.chartType = chartType(codebook, variable); // calculate statistics prior to determining chart type
        variable.bins = bins(codebook, variable); // calculate statistics prior to calculating number of bins
        summarizeGroups(codebook, variable); // update summarizeGroups to return a value rather than modifying variable in place
    });
    console.log(summary);
    //codebook.data.summary = codebook.data.filtered.length > 0
    //    ? codebook.data.variables.map(variable => {
    //        const varObj = {value_col: variable};

    //        varObj.values = defineVariableArray(codebook, varObj);
    //        varObj.metadata = attachMetadata(codebook, varObj);
    //        varObj.statistics = calculateStatistics(codebook, varObj);
    //        varObj.chartType = chartType(codebook, variable); // calculate statistics prior to determining chart type
    //        varObj.bins = bins(codebook, varObj); // calculate statistics prior to calculating number of bins
    //        summarizeGroups(codebook, varObj); // update summarizeGroups to return a value rather than modifying varObj in place

    //        return varObj;
    //    })
    //    : [];

    //end performance test
    const t1 = performance.now();
    console.log(`[makeSummary] took ${t1 - t0} milliseconds.`);

    return summary;
}
