import { init as initToggle } from './chartToggle/init';
import { init as initDetailSelect } from './detailSelect/init';
import { init as initColumnSelect } from './columnSelect/init';

export function update(codebook) {
  var activeTab = codebook.nav.tabs.filter(d => d.active)[0];

  //add instructions text
  codebook.instructions.wrap.text(activeTab.instructions);

  //add tab-specific controls
  if (activeTab.key == 'codebook') {
    initDetailSelect(codebook);
    initToggle(codebook);
  } else if (activeTab.key == 'chartMaker') {
    initColumnSelect(codebook);
    codebook.chartMaker.draw(codebook);
  }
}
