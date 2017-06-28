import { set as d3set } from "d3";
import summarize from "./summarize/index";

export function makeSummary(codebook) {
  var data = codebook.data.filtered;
  var group = codebook.config.group;

  function determineType(vector) {
    const nonMissingValues = vector.filter(d => !/^\s*$/.test(d));
    const numericValues = nonMissingValues.filter(d => !isNaN(+d));
    const distinctValues = d3set(numericValues).values();

    return nonMissingValues.length === numericValues.length &&
      distinctValues.length > codebook.config.levelSplit
      ? "continuous"
      : "categorical";
  }

  const summarize = {
    categorical: function(vector) {
      const statistics = {};
      statistics.N = vector.length;
      const nonMissing = vector.filter(d => !/^\s*$/.test(d) && d !== "NA");
      statistics.n = nonMissing.length;
      statistics.nMissing = vector.length - statistics.n;
      statistics.unique = d3set(vector).values().length
      statistics.values = d3nest()
        .key(d => d)
        .rollup(d => {
          return {
            n: d.length,
            prop_N: d.length / statistics.N,
            prop_n: d.length / statistics.n,
            prop_N_text: d3format("0.1%")(d.length / statistics.N),
            prop_n_text: d3format("0.1%")(d.length / statistics.n),
            unique: d3set(vector).values().length
          };
        })
        .entries(nonMissing);


      statistics.values.forEach(value => {
        for (var statistic in value.values) {
          value[statistic] = value.values[statistic];
        }
        delete value.values;
      });

      return statistics;
    },

    continuous: function(vector) {
      const statistics = {};
      statistics.N = vector.length;
      const nonMissing = vector
        .filter(d => !isNaN(+d) && !/^\s*$/.test(d))
        .map(d => +d)
        .sort((a, b) => a - b);
      statistics.n = nonMissing.length;
      statistics.nMissing = vector.length - statistics.n;
      statistics.mean = d3format("0.2f")(d3mean(nonMissing));
      statistics.SD = d3format("0.2f")(d3deviation(nonMissing));
      const quantiles = [
        ["min", 0],
        ["5th percentile", 0.05],
        ["1st quartile", 0.25],
        ["median", 0.5],
        ["3rd quartile", 0.75],
        ["95th percentile", 0.95],
        ["max", 1]
      ];
      quantiles.forEach(quantile => {
        let statistic = quantile[0];
        statistics[statistic] = d3format("0.1f")(
          d3quantile(nonMissing, quantile[1])
        );
      });

      return statistics;
    }
  };

  if (codebook.data.filtered.length > 0) {
    const variables = Object.keys(data[0]);
    variables.forEach((variable, i) => {
      //Define variable data vector and metadata.
      variables[i] = { value_col: variable };
      variables[i].values = data.map(d => d[variable]);
      variables[i].type = summarize.determineType(
        variables[i].values,
        codebook.config.levelSplit
      );
      variables[i].label = codebook.config.variableLabels
        .map(variableLabel => variableLabel.value_col)
        .indexOf(variable) > -1
        ? codebook.config.variableLabels.filter(
            variableLabel => variableLabel.value_col === variable
          )[0].label
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
