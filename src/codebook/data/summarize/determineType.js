import { set as d3set } from 'd3';

export default function determineType(vector, levelSplit) {
  const nonMissingValues = vector.filter(d => !/^\s*$/.test(d.value));
  const numericValues = nonMissingValues.filter(d => !isNaN(+d.value));
  const distinctValues = d3set(numericValues.map(d => d.value)).values();

  return nonMissingValues.length === numericValues.length &&
    distinctValues.length > levelSplit
    ? 'continuous'
    : 'categorical';
}
