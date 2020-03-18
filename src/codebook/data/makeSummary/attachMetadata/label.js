export default function label(codebook, variable) {
    const variableLabel = codebook.config.variableLabels.find(variableLabel => variableLabel.value_col === variable.value_col);
    const label = variableLabel !== undefined
            ? variableLabel.label
            : variable.value_col;
    return label;
}
