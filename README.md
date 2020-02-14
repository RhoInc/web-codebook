# Web Codebook

![alt tag](https://user-images.githubusercontent.com/31038805/33682586-fb48c2cc-da95-11e7-87d9-79982b1aa8ed.gif)

## Overview

The web codebook is a JavaScript library that provides a concise summary of every variable in a dataset. The codebook includes interactive features such as real-time filters and requires minimal user configuration.
 [Click here for a live demo](https://rhoinc.github.io/web-codebook/test-page/default/). When the page loads, the user sees a "codebook" providing a graphical data summary for each data column.
 
 
![alt tag](https://user-images.githubusercontent.com/31038805/33683185-0f6d9c44-da98-11e7-829d-24f41e77ffc2.gif)

The library also provides an `explorer` function ([demo](https://rhoinc.github.io/web-codebook/test-page/explorer/)) that lets users explorer codebooks for multiple files from the same webpage. Finally, the associated [datadigest R package](https://github.com/RhoInc/datadigest) wraps the web-codebook functionality in easy-to-use R functions. 

## Background

The web-codebook is inspired Frank Harrell's excellent `summarize` method from the [Hmisc R package](https://cran.r-project.org/web/packages/Hmisc/Hmisc.pdf). `summarize` creates concise data summaries with minimal user configuration. Further,  [Agustin Calatroni](http://graphics.rhoworld.com/pubs/SCT2007_Calatroni.pdf) and  [Shane Rosanbalm](https://github.com/RhoInc/sas-codebook) have created SAS data summary methods at Rho in recent years.  Our goal here is to create a web-based data summary that uses the same general principles (concise data display, minimal configuration), but with added interactivity (filters, paneled displays, data listings) that is not possible in the static displays created by Hmisc or in SAS. 

## Typical Usage
Generally speaking, no configuration is needed to create a web-codebook. Just [load a JSON data set](https://github.com/RhoInc/web-codebook/wiki/Data-Guidelines) and the tool will automatically create a user interface (filters, etc.) based on the data set loaded. Initialize the chart like so: 

```javascript
webcodebook.createChart('#chartLocation', {}).init(data);
```

See the [API](https://github.com/RhoInc/web-codebook/wiki/API) and [Configuration](https://github.com/RhoInc/web-codebook/wiki/Codebook-Configuration) pages for more details about custom configurations. 

## Links 

- [Interactive Codebook Example](https://rhoinc.github.io/web-codebook/test-page/default/)
- [Interactive Explorer Example](https://rhoinc.github.io/web-codebook/test-page/explorer/)
- [Configuration](https://github.com/RhoInc/web-codebook/wiki/Codebook-Configuration) 
- [API](https://github.com/RhoInc/web-codebook/wiki/API)
- [Technical Documentation](https://github.com/RhoInc/web-codebook/wiki/Technical-Documentation) 
- [Data Guidelines](https://github.com/RhoInc/web-codebook/wiki/Data-Guidelines)
- [datadigest R Package](https://github.com/RhoInc/datadigest)

