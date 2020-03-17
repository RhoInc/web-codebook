const availableTabs = [
    {
        key: 'files',
        label: 'Files',
        selector: '.fileListing',
        controls: false,
        instructions: 'Click a row to see the codebook for the file.'
    },
    {
        key: 'codebook',
        label: 'Codebook',
        selector: '.summaryTable',
        controls: true,
        instructions: 'Automatically generated data summaries for each column.'
    },
    {
        key: 'listing',
        label: 'Data Listing',
        selector: '.dataListing',
        controls: true,
        instructions: 'Listing of all selected records.'
    },
    {
        key: 'chartMaker',
        label: 'Charts',
        selector: '.chartMaker',
        controls: true,
        instructions:
            'Pick two variables to compare. Filter and group (panel) the chart using the controls above.'
    },
    {
        key: 'settings',
        label: '&#x2699;',
        selector: '.settings',
        controls: false,
        instructions:
            "This interactive table allows users to modify each column's metadata. Updating these settings will reset the codebook and data listing."
    }
];

export default availableTabs;
