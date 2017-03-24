import clone from './util/clone';

export default
  //Custom settings
    {measure: null
    ,panel: null
    ,measureFormat: ',.2f'
    ,boxPlot: true
    ,mean: true
    ,nBins: 100
    ,overall: false

  //Webcharts settings
    ,x: {column: null // set in syncSettings()
        ,type: 'linear'
        ,label: ''
        ,bin: null} // set in syncSettings()
    ,y: {column: null // set in syncSettings()
        ,type: 'linear'
        ,label: ''
        ,domain: [0,null]}
    ,marks:
        [
            {type: 'bar'
            ,per: null // set in syncSettings()
            ,summarizeX: 'mean'
            ,summarizeY: 'count'}
        ]
    ,gridlines: 'y'
    ,resizable: true
    ,aspect: 12
    ,margin:
        {right: 25
        ,left: 100} // space for panel value
    };

//Replicate settings in multiple places in the settings object.
export function syncSettings(settings) {
    const syncedSettings = clone(settings);

    if (syncedSettings.panel === null)
        syncedSettings.overall = true;
    syncedSettings.x.column = settings.measure;
    syncedSettings.x.bin = settings.nBins;
    syncedSettings.y.column = settings.measure;
    syncedSettings.y.label = settings.measure;
    syncedSettings.marks[0].per = [settings.measure];

    return syncedSettings;
}
