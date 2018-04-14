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
	var fileList = fileList.map(function(m){
		m.path = "https://rawgit.com/RhoInc/viz-library/master"+m.rel_path.slice(1);
		return m;
	})
	var settings = {
		labelColumn:"filename",
		ignoredColumns: ["local_path","rel_path","path"],
		files:fileList
	};
	var explorer = webcodebook.createExplorer("#container", settings).init();
}
initExplorer(dataFiles)
