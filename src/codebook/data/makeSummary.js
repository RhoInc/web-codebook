import { set as d3set } from "d3";
import summarize from './summarize/index';

export function makeSummary(codebook) {
  var data = codebook.data.filtered;
  var group = codebook.config.group;

  if (codebook.data.filtered.length > 0) {
    const variables = Object.keys(data[0]);
    variables.forEach((variable, i) => {
      //Define variable data vector and metadata.
      variables[i] = {value_col: variable};
      variables[i].values = data.map(d => d[variable]);
      variables[i].type = summarize.determineType(variables[i].values, codebook.config.levelSplit);
      variables[i].label = codebook.config.variableLabels.map(variableLabel => variableLabel.value_col).indexOf(variable) > -1
            ? codebook.config.variableLabels.filter(variableLabel => variableLabel.value_col === variable)[0].label
            : variable;
      variables[i].statistics = variables[i].type === "continuous"
        ? summarize.continuous(variables[i].values)
        : summarize.categorical(variables[i].values);
      variables[i].chartType = variables[i].type == "continuous"
        ? "histogramBoxPlot"
        : (variables[i].type == "categorical") &
            (variables[i].statistics.values.length > codebook.config.levelSplit)
            ? "verticalBars"
            : (variables[i].type == "categorical") &
                (variables[i].statistics.values.length <=
                  codebook.config.levelSplit)
                ? "horizontalBars"
                : "error";

      //Handle groups.
      if (group) {
        variables[i].group = group;
        variables[i].groups = d3set(data.map(d => d[group])).values().map(g => {
          return { group: g };
        });

        variables[i].groups.forEach(g => {
          //Define variable metadata and generate data array.
          g.value_col = variable;
          g.values = data
            .filter(d => d[group] === g.group)
            .map(d => d[variable]);
          g.type = variables[i].type;

          //Calculate statistics.
          if (variables[i].type === "categorical")
            g.statistics = summarize.categorical(g.values);
          else g.statistics = summarize.continuous(g.values);
        });
      }
    });

    codebook.data.summary = variables;
    //get bin counts
    codebook.util.getBinCounts(codebook);
  } else {
    codebook.data.summary = [];
  }
}
