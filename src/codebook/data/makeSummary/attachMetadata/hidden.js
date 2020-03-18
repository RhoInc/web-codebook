export default function hidden(codebook, variable) {
    const hidden = codebook.config.hiddenVariables.includes(variable.value_col);
    return hidden;
}
