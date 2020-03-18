export default function meta(codebook, variable) {
    const meta = [];
    const variableMeta = codebook.config.meta
        .find(variableMetadata => variableMetadata.value_col === variable.value_col);

    if (variableMeta !== undefined)
        Object.keys(variableMeta)
            .filter(key => !['value_col', 'label'].includes(key))
            .forEach(key => {
                meta.push({ key, value: variableMeta[key] });
            });

    return meta;
}
