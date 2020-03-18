import hidden from './attachMetadata/hidden';
import chartVisibility from './attachMetadata/chartVisibility';
import label from './attachMetadata/label';
import type from './attachMetadata/type';
import meta from './attachMetadata/meta';

export default function attachMetadata(codebook, variable) {
    variable.hidden = hidden(codebook, variable);
    variable.chartVisibility = chartVisibility(codebook, variable);
    variable.label = label(codebook, variable);
    variable.type = type(codebook, variable);
    variable.meta = meta(codebook, variable);

    return {
        hidden,
        chartVisibility,
        label,
        type,
        meta,
    };
}
