export function makeCodebook(meta) {
  this.codebookWrap.selectAll("*").remove();
  var codebook = webcodebook.createCodebook(
    ".web-codebook-explorer .codebookWrap",
    meta.settings
  );
  d3.csv(meta.path, function(error, data) {
    codebook.init(data);
  });
}
