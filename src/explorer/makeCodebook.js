import { csv as d3csv } from 'd3';

export function makeCodebook(meta) {
  this.codebookWrap.selectAll('*').remove();
  var codebook = webcodebook.createCodebook(
    '.web-codebook-explorer .codebookWrap',
    meta.settings
  );
  d3csv(meta.path, function(error, data) {
    codebook.init(data);
  });
}
