export default function determineType(vector, levelSplit) {
    let type = 'continuous';

    const n = vector.length;
    const nUnique = [];
    const missingRegex = /^\s*$/;
    const numberRegex = /^-?[0-9]*\.?[0-9]*$/;

    for (let i = 0; i < n; i++) {
        const scalar = vector[i];

        if (typeof scalar === 'number')
            break;

        if (!nUnique.includes(scalar))
            nUnique.push(scalar);

        if (scalar === null || scalar === undefined || missingRegex.test(scalar))
            continue;

        if (numberRegex.test(scalar))
            continue;

        type = 'categorical';
        break;
    }

    if (type === 'continuous' && nUnique.length <= levelSplit)
        type = 'categorical';

    return type;
}
