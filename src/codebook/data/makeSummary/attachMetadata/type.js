import determineType from './type/determineType';

export default function type(codebook, variable) {
    const variableType = codebook.config.variableTypes
        .find(variableType => variableType.value_col === variable.value_col);
    const type = variableType
            ? variableType.type
            : determineType(
                variable.values,
                codebook.config.levelSplit
            );
    return type;
}
