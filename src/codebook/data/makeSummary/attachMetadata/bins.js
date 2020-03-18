import calculateNumberOfBins from './bins/calculateNumberOfBins';

export default function bins(codebook, variable) {
    let bins;

    if (variable.type === 'continuous') {
        const bins = codebook.config.autoBins
            ? codebook.config.nBins
            : calculateNumberOfBins(codebook, variable);

        if (Object.keys(codebook.config).indexOf('group') > -1) {
            variable.groups.forEach(group => {
                group.bins = codebook.config.autoBins
                    ? codebook.config.nBins
                    : calculateNumberOfBins(codebook, group);
            });
        }
    }

    return bins;
}
