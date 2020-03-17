// Makes a valid settings object for the current selections.
// settings is the settings object that needs updated
// xvar and yvar are data objects created by codebook/data/makeSummary.js

export default function makeSettings(settings, xvar, yvar) {
    //set x config
    settings.x = {
        column: xvar.value_col,
        label: xvar.label,
        type: xvar.type == 'categorical' ? 'ordinal' : 'linear'
    };

    //set y config
    settings.y = {
        column: yvar.value_col,
        label: yvar.label,
        type: yvar.type == 'categorical' ? 'ordinal' : 'linear'
    };

    // set mark and color
    if ((settings.x.type == 'linear') & (settings.y.type == 'linear')) {
        //mark types: x = linear vs. y = linear
        settings.marks = [
            {
                type: 'circle',
                per: ['web-codebook-index']
            }
        ];
        settings.legend = null;
        settings.color_by = 'highlight';
        settings.colors = ['#999', 'orange'];
    } else if ((settings.x.type == 'linear') & (settings.y.type == 'ordinal')) {
        //mark types: x = linear vs. y = ordinal
        settings.marks = [
            {
                type: 'circle',
                per: ['web-codebook-index']
            },
            {
                type: 'text',
                text: '|',
                per: [yvar.value_col],
                summarizeX: 'mean',
                attributes: {
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle'
                }
            }
        ];
        settings.legend = null;
        settings.color_by = 'highlight';
        settings.colors = ['#999', 'orange'];
    } else if ((settings.x.type == 'ordinal') & (settings.y.type == 'linear')) {
        //mark types: x = ordinal vs. y = linear
        settings.marks = [
            {
                type: 'circle',
                per: ['web-codebook-index']
            },
            {
                type: 'text',
                text: '---',
                per: [xvar.value_col],
                summarizeY: 'mean',
                attributes: {
                    'text-anchor': 'middle',
                    'alignment-baseline': 'middle'
                }
            }
        ];
        settings.legend = null;
        settings.color_by = 'highlight';
        settings.colors = ['#999', 'orange'];
    } else if (
        (settings.x.type == 'ordinal') &
        (settings.y.type == 'ordinal')
    ) {
        //mark types: x = ordinal vs. y = ordinal

        settings.y = {
            column: '',
            type: 'linear',
            label: 'Number of observations',
            domain: [0, null]
        };
        settings.marks = [
            {
                type: 'bar',
                arrange: 'stacked',
                split: yvar.value_col,
                per: [xvar.value_col],
                summarizeY: 'count'
            }
        ];
        settings.legend = { label: yvar.label };
        settings.color_by = yvar.value_col;
        settings.colors = [
            '#e41a1c',
            '#377eb8',
            '#4daf4a',
            '#984ea3',
            '#ff7f00',
            '#ffff33',
            '#a65628',
            '#f781bf',
            '#999999'
        ];
    }
    return settings;
}
