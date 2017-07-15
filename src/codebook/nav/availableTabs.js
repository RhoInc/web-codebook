const availableTabs = [
  {
    key: 'files',
    label: 'Files',
    selector: '.web-codebook .fileListing',
    controls: false
  },
  {
    key: 'codebook',
    label: 'Codebook',
    selector: '.web-codebook .summaryTable',
    controls: true
  },
  {
    key: 'listing',
    label: 'Data Listing',
    selector: '.web-codebook .dataListing',
    controls: true
  },
  {
    key: 'settings',
    label: '&#x2699;',
    selector: '.web-codebook .settings',
    controls: false
  }
];

export default availableTabs;
