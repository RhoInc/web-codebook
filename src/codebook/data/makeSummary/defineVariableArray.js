export default function defineVariableArray(codebook, variable) {
    const variableArray = codebook.data.filtered.map(d => {
        const index = d['web-codebook-index'];
        const value = d[variable.value_col];
        const isMissing = (
            (codebook.config.whiteSpaceMissing && /^\s*$/.test(value))
            || codebook.config.missingValues.includes(value)
        );
        const isNumber = !isMissing
            ? /^-?[0-9]*\.?[0-9]*$/.test(value)
            : false;
        const isString = !isMissing && !isNumber;
        const isHighlighted = codebook.data.highlighted.includes(d);

        return {
            index,
            value,
            missing: isMissing,
            number: isNumber,
            string: isString,
            highlighted: isHighlighted,
        };
    });

    return variableArray;
}
