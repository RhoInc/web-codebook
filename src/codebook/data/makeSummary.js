import { set as d3set } from 'd3';
import summarize from './summarize/index';

export function makeSummary(codebook) {
  var data = codebook.data.filtered;
  var group = codebook.config.group;

  if (codebook.data.filtered.length > 0) {
    const variables = Object.keys(data[0]);
    variables.forEach(function(variable, i) {
      //change from string to object
      variables[i] = { value_col: variable };

      //get a list of values
      variables[i].values = data.map(d => {
        return {
          index: d['web-codebook-index'],
          value: d[variable],
          highlighted: codebook.data.highlighted.indexOf(d) > -1
        };
      });
      console.log(variables[i].values);

      //get variable type
      variables[i].type = summarize.determineType(
        variables[i].values,
        codebook.config.levelSplit
      );

      //get hidden status
      variables[i].hidden =
        codebook.config.hiddenVariables.indexOf(variable) > -1;

      //get variable label
      variables[i].label = codebook.config.variableLabels
        .map(variableLabel => variableLabel.value_col)
        .indexOf(variable) > -1
        ? codebook.config.variableLabels.filter(
            variableLabel => variableLabel.value_col === variable
          )[0].label
        : variable;

      //calculate variable statistics (including for highlights - if any)
      var sub = codebook.data.highlighted.length > 0
        ? function(d) {
            return d.highlighted;
          }
        : null;
      variables[i].statistics = variables[i].type === 'continuous'
        ? summarize.continuous(variables[i].values, sub)
        : summarize.categorical(variables[i].values, sub);

      //get chart type
      variables[i].chartType = variables[i].type == 'continuous'
        ? 'histogramBoxPlot'
        : (variables[i].type == 'categorical') &
            (variables[i].statistics.values.length > codebook.config.levelSplit)
          ? 'verticalBars'
          : (variables[i].type == 'categorical') &
              (variables[i].statistics.values.length <=
                codebook.config.levelSplit)
            ? 'horizontalBars'
            : 'error';

      //Handle groups.
      if (group) {
        variables[i].group = group;
        variables[i].groupLabel = codebook.config.variableLabels
          .map(variableLabel => variableLabel.value_col)
          .indexOf(group) > -1
          ? codebook.config.variableLabels.filter(
              variableLabel => variableLabel.value_col === group
            )[0].label
          : group;
        variables[i].groups = d3set(data.map(d => d[group])).values().map(g => {
          return { group: g };
        });

        variables[i].groups.forEach(g => {
          //Define variable metadata and generate data array.
          g.value_col = variable;
          g.values = data.filter(d => d[group] === g.group).map(d => {
            return {
              index: d['web-codebook-index'],
              value: d[variable]
            };
          });
          g.type = variables[i].type;

          //Calculate statistics.
          if (variables[i].type === 'categorical')
            g.statistics = summarize.categorical(g.values);
          else g.statistics = summarize.continuous(g.values);
        });
      }
    });

    codebook.data.summary = variables;
    //get bin counts
    codebook.util.getBinCounts(codebook);
    console.log(codebook);
  } else {
    codebook.data.summary = [];
  }
}
