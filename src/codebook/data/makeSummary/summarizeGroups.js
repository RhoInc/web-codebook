import calculateStatistics from './calculateStatistics';
import { nest, set as d3set } from 'd3';

export default function summarizeGroups(codebook, variable) {
    if (codebook.config.group) {
        variable.group = codebook.config.group;
        variable.groupLabel =
            codebook.config.variableLabels
                .map(variableLabel => variableLabel.value_col)
                .includes(codebook.config.group)
                ? codebook.config.variableLabels.filter(
                    variableLabel => variableLabel.value_col === codebook.config.group
                )[0].label
                : codebook.config.group;
        variable.groups = d3.nest()
            .key(d => d[codebook.config.book])
            .rollup(data => {
                return data.map(d => {
                    const datum = {
                        index: d['web-codebook-index'],
                        value: datum[variable.value_col],
                        highlighted: codebook.data.highlighted.includes(d),
                    };
                });
            })
            .entries(codebook.data.filtered)
            .map(group => {
                group.group = group.key;
                delete group.key;
                group.value_col = variable.value_col;
                group.type = variable.type;
                group.statistics = calculateStatistics(codebook, group);
                return group;
            });
    }
}
