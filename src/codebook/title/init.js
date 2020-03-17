export function init(codebook) {
    codebook.title.fileWrap = codebook.title.wrap
        .append('span')
        .attr('class', 'file')
        .text(
            codebook.config.dataName
                ? codebook.config.dataName + ' Codebook'
                : 'Codebook'
        );

    codebook.title.countSummary = codebook.title.wrap
        .append('span')
        .attr('class', 'countSummary');

    codebook.title.highlight.init(codebook);

    codebook.title.updateCountSummary(codebook);
}
