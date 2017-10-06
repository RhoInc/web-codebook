// Makes a valid settings object for the current selections.
// settings is the settings object that needs updated
// var1 and var2 are data objects created by codebook/data/makeSummary.js

export default function makeSettings(settings, var1, var2) {
  //set x config
  settings.x = {
    column: var1.value_col,
    label: var1.label,
    type: var1.type == 'categorical' ? 'ordinal' : 'linear'
  };

  //set y config
  settings.y = {
    column: var2.value_col,
    label: var2.label,
    type: var2.type == 'categorical' ? 'ordinal' : 'linear'
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
    settings.color_by = null;
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
        per: [var2.value_col],
        summarizeX: 'mean'
      }
    ];
    settings.color_by = var2.value_col;
  } else if ((settings.x.type == 'ordinal') & (settings.y.type == 'linear')) {
    //mark types: x = ordinal vs. y = linear
    settings.marks = [
      {
        type: 'circle',
        per: ['web-codebook-index']
      },
      {
        type: 'text',
        text: '-',
        per: [var1.value_col],
        summarizeY: 'mean'
      }
    ];
    settings.color_by = var1.value_col;
  } else if ((settings.x.type == 'ordinal') & (settings.y.type == 'ordinal')) {
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
        split: var2.value_col,
        per: [var1.value_col],
        summarizeY: 'count'
      }
    ];
    settings.color_by = var2.value_col;
  }
  return settings;
}
