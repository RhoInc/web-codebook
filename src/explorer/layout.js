/*------------------------------------------------------------------------------------------------\
  Generate HTML containers.
\------------------------------------------------------------------------------------------------*/

export function layout() {  
    this.controls.wrap = this.wrap
        .append('div')
        .attr('class', 'controls');

    this.codebookWrap = this.wrap
        .append('div')
        .attr('class', 'codebookWrap');

   	 
}
