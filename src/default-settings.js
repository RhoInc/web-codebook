const settings = {
    //Addition settings for this template
    

    //Standard webcharts settings
    
};

// Replicate settings in multiple places in the settings object
export function syncSettings(settings){
    //example: settings.y.column = settings.id_col;
    return settings;
}

// Default Control objects
export const controlInputs = [ 
	//example:  {label: "Severity", type: "subsetter", multiple: true},
];

// Map values from settings to control inputs
export function syncControlInputs(controlInputs, settings){
    //example: 
    //	var measureControl = controlInputs.filter(function(d){return d.label=="Measure"})[0] 
    //  measureControl.value_col = mergedSettings.measure_col; 
    return controlInputs
}

export default settings
