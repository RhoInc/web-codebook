const availableTabs = [
  {
    key: 'files',
    label: 'Files',
    selector: '.web-codebook .fileListing',
    controls: false,
    instructions: 'Click a row to see the codebook for the file.'
  },
  {
    key: 'codebook',
    label: 'Codebook',
    selector: '.web-codebook .summaryTable',
    controls: true,
    instructions: 'Automatically generated data summaries for each column.'
  },
  {
    key: 'listing',
    label: 'Data Listing',
    selector: '.web-codebook .dataListing',
    controls: true,
    instructions: 'Click any column header to sort that column.'
  },
  {
    key: 'chartMaker',
    label: 'Charts',
    selector: '.web-codebook .chartMaker',
    controls: true,
    instructions:
      'Pick two variables to compare. Filter and group (panel) the chart using the controls above.'
  },
  {
    key: 'settings',
    label: '&#x2699;',
    selector: '.web-codebook .settings',
    controls: false,
    instructions:
      "This interactive table allows users to modify each column's metadata. Updating these settings will reset the codebook and data listing."
  }
];

export default availableTabs;
