export function init(codebook) {
  codebook.title.fileWrap = codebook.title.wrap
    .append('span')
    .attr('class', 'file')
    .text(
      codebook.config.dataName
        ? codebook.config.dataName + ' Codebook'
        : 'Codebook'
    );

  codebook.title.countSpan = codebook.title.wrap
    .append('span')
    .attr('class', 'columnCount');

  codebook.title.updateColumnCount(codebook);
}
