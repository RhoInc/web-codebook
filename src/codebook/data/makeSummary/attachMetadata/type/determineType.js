export default function determineType(vector, levelSplit) {
    let type = 'continuous';

    for (let i = 0; i < vector.length; i++) {
        const scalar = vector[i];

        if (scalar.missing) {
            continue;
        }

        if (scalar.number) {
            continue;
        }

        type = 'categorical';
        break;
    }

    return type;
}
