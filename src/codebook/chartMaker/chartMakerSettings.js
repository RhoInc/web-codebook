const chartMakerSettings = {
    width: 800, //changed to 300 for paneled charts
    aspect: 1.5,
    resizable: false,
    x: {
        column: null,
        type: null,
        label: null
    },
    y: {
        column: null,
        type: null,
        label: null
    },
    marks: [
        {
            type: null,
            per: ['row_index']
        }
    ],
    colors: ['#999', 'orange'],
    color_by: 'highlight'
};

export default chartMakerSettings;
