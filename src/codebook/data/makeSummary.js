import defineVariableArray from './makeSummary/defineVariableArray';
import attachMetadata from './makeSummary/attachMetadata';
import calculateStatistics from './makeSummary/calculateStatistics';
import chartType from './makeSummary/attachMetadata/chartType';
import bins from './makeSummary/attachMetadata/bins';
import summarizeGroups from './makeSummary/summarizeGroups';

export function makeSummary(codebook) {
    const t0 = performance.now();
    //begin performance test

    //codebook.data.summary = summary;
    codebook.data.summary = codebook.data.filtered.length > 0
        ? codebook.data.variables.map(variable => {
            const varObj = {value_col: variable};

            varObj.values = defineVariableArray(codebook, varObj);
            varObj.metadata = attachMetadata(codebook, varObj);
            varObj.statistics = calculateStatistics(codebook, varObj);
            varObj.chartType = chartType(codebook, varObj); // calculate statistics prior to determining chart type
            varObj.bins = bins(codebook, varObj); // calculate statistics prior to calculating number of bins
            summarizeGroups(codebook, varObj); // update summarizeGroups to return a value rather than modifying varObj in place

            return varObj;
        })
        : [];
    console.log(codebook.data.summary);

    //end performance test
    const t1 = performance.now();
    console.log(`[makeSummary] took ${t1 - t0} milliseconds.`);
}
