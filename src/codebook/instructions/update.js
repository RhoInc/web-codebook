export function update(codebook) {
  var instructionText = codebook.nav.tabs.filter(d => d.active)[0].instructions;
  codebook.instructions.wrap.text(instructionText);
}
