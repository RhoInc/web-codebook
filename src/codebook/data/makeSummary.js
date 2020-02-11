import { nest, set as d3set } from 'd3';
import summarize from './summarize/index';

export function makeSummary(codebook) {
  const config = codebook.config;
  var data = codebook.data.filtered;
  var group = codebook.config.group;

  if (codebook.data.filtered.length > 0) {
    const variables = Object.keys(data[0]).map(function(variable) {
      //change from string to object
      var varObj = { value_col: variable };

      //get a list of raw values
      varObj.values = data.map(d => {
        var current = {
          index: d['web-codebook-index'],
          value: d[variable],
          highlighted: codebook.data.highlighted.indexOf(d) > -1,
          missingWhiteSpace: config.whiteSpaceAsMissing
            ? /^\s*$/.test(d[variable])
            : false,
          missingValue: config.missingValues.indexOf(d[variable]) > -1
        };
        current.missing = current.missingWhiteSpace || current.missingValue;

        return current;
      });

      //get hidden status
      varObj.hidden = codebook.config.hiddenVariables.indexOf(variable) > -1;
      varObj.chartVisibility = codebook.config.chartVisibility;

      //get variable label
      varObj.label =
        codebook.config.variableLabels
          .map(variableLabel => variableLabel.value_col)
          .indexOf(variable) > -1
          ? codebook.config.variableLabels.filter(
              variableLabel => variableLabel.value_col === variable
            )[0].label
          : variable;

      //Determine Type
      varObj.type =
        codebook.config.variableTypes
          .map(variableType => variableType.value_col)
          .indexOf(variable) > -1
          ? codebook.config.variableTypes.filter(
              variableLabel => variableLabel.value_col === variable
            )[0].type
          : summarize.determineType(varObj.values, codebook.config.levelSplit);

      // update missingness for non-numeric values in continuous columns
      if (varObj.type == 'continuous') {
        varObj.values.forEach(function(d, i) {
          d.numeric = !isNaN(d.value) && !isNaN(parseFloat(d.value));
          d.missing = d.missing || !d.numeric;
        });
      }

      //create a list of missing values
      const missings = varObj.values.filter(f => f.missing).map(m => m.value);
      if (missings.length) {
        varObj.missingList = nest()
          .key(d => d)
          .rollup(d => d.length)
          .entries(missings)
          .sort((a, b) => b.values - a.values);

        varObj.missingSummary = varObj.missingList
          .map(m => '"' + m.key + '" (n=' + m.values + ')')
          .join('\n');
      } else {
        varObj.missingList = [];
      }

      // Add metadata Object
      varObj.meta = [];
      var metaMatch = codebook.config.meta.filter(f => f.value_col == variable);
      if (metaMatch.length == 1) {
        var metaKeys = Object.keys(metaMatch[0]).filter(
          f => ['value_col', 'label'].indexOf(f) === -1
        );
        metaKeys.forEach(function(m) {
          varObj.meta.push({ key: m, value: metaMatch[0][m] });
        });
      }

      //calculate variable statistics (including for highlights - if any)
      var sub =
        codebook.data.highlighted.length > 0
          ? function(d) {
              return d.highlighted;
            }
          : null;
      varObj.statistics =
        varObj.type === 'continuous'
          ? summarize.continuous(varObj.values, sub)
          : summarize.categorical(varObj.values, sub);

      //get chart type
      varObj.chartType = 'none';
      if (varObj.type == 'continuous') {
        varObj.chartType = 'histogramBoxPlot';
      } else if (varObj.type == 'categorical') {
        if (varObj.statistics.values.length > codebook.config.maxLevels) {
          varObj.chartType = 'character';
          varObj.summaryText =
            'Character columns with ' +
            varObj.statistics.values.length +
            ' unique levels.<br>' +
            "<span class='caution'><span class='drawLevel'>Click here</span> to treat this variable as categorical and draw a histogram with " +
            varObj.statistics.values.length +
            ' levels. Note that this may slow down or crash your browser.</span>';
        } else if (
          varObj.statistics.values.length > codebook.config.levelSplit
        ) {
          varObj.chartType = 'verticalBars';
        } else if (
          varObj.statistics.values.length <= codebook.config.levelSplit
        ) {
          varObj.chartType = 'horizontalBars';
        }
      }

      //Handle groups.
      if (group) {
        varObj.group = group;
        varObj.groupLabel =
          codebook.config.variableLabels
            .map(variableLabel => variableLabel.value_col)
            .indexOf(group) > -1
            ? codebook.config.variableLabels.filter(
                variableLabel => variableLabel.value_col === group
              )[0].label
            : group;
        varObj.groups = d3set(data.map(d => d[group]))
          .values()
          .map(g => {
            return { group: g };
          });

        varObj.groups.forEach(g => {
          //Define variable metadata and generate data array.
          g.value_col = variable;
          g.values = data.filter(d => d[group] === g.group).map(d => {
            return {
              index: d['web-codebook-index'],
              value: d[variable],
              highlighted: codebook.data.highlighted.indexOf(d) > -1
            };
          });
          g.type = varObj.type;

          //Calculate statistics.
          if (varObj.type === 'categorical')
            g.statistics = summarize.categorical(g.values, sub);
          else g.statistics = summarize.continuous(g.values, sub);
        });
      }
      return varObj;
    });

    codebook.data.summary = variables;
    //get bin counts
    codebook.util.getBinCounts(codebook);
  } else {
    codebook.data.summary = [];
  }
}
