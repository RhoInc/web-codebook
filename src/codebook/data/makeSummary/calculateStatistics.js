import categorical from './calculateStatistics/categorical';
import continuous from './calculateStatistics/continuous';

export default function calculateStatistics(codebook, variable) {
    const summaries = {categorical,continuous};
    const statistics = summaries[variable.type](
        variable.values,
        codebook.data.highlighted.length > 0
            ? d => d.highlighted
            : null
    );

    return statistics;
}
