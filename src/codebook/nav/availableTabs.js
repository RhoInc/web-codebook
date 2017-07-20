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
    instructions: ''
  },
  {
    key: 'listing',
    label: 'Data Listing',
    selector: '.web-codebook .dataListing',
    controls: true,
    instructions: 'Click any column header to sort that column.'
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
