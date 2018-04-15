//Load local build if in local environment.
if (window.origin !== 'https://rhoinc.github.io') {
    var head = document.getElementsByTagName('head')[0];

  //...load local build.
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '../webcodebook.js';
    head.appendChild(script);

  //...load local stylesheet.
    for (var i = 0; i < document.styleSheets.length; i++) {
        var styleSheet = document.styleSheets[i];
        if (styleSheet.href.indexOf('webcodebook') > -1)
            styleSheet.disabled = true;
    }
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = '../../css/webcodebook.css';
    head.appendChild(link);   head.appendChild(script);
}

function initExplorer(fileList){
  console.log(fileList)
  var metaFiles = ["AE","DM","LB"] //list of files to add meta data
  d3.csv("https://rawgit.com/RhoInc/viz-library/master/data/safetyData/variableMetaData.csv",function(error,meta){
    meta.forEach(function(f){
      f.file = f.Form+".csv"
      f.label = f.Label
      console.log(f)
    })
    var fileList_clean = fileList.map(function(f){
  		f.path = "https://rawgit.com/RhoInc/viz-library/master"+f.rel_path.slice(1);
      f.shortname = f.filename.replace(/\.[^/.]+$/, "")
      if(metaFiles.indexOf(f.shortname)>-1){
        f.meta = meta.filter(m=>m.Form == f.shortname)
        .map(function(m){
          m.value_col = m.Variable;
          return m;
        })
        f["Metadata included?"] = "Yes"
      }else{
        f["Metadata included?"] = "No"
      }
  		return f;
  	})

  	var settings = {
  		labelColumn:"filename",
  		ignoredColumns: ["local_path","rel_path","path"],
  		files:fileList_clean,
      meta:meta
  	};
  	var explorer = webcodebook.createExplorer("#container", settings).init();
  })

}

initExplorer(dataFiles)
