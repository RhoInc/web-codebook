export default function onInit() {
    //Add group labels.
    var chart = this;
    if (this.config.group_col) {
        const groupTitle = this.wrap
            .append('p')
            .attr('class', 'panel-label')
            .style('margin-left', chart.config.margin.left + 'px')
            .html(
                `${this.config.group_col}: <strong>${
                    this.config.group_val
                }</strong> (n=${this.config.n})`
            );
        this.wrap
            .node()
            .parentNode.insertBefore(groupTitle.node(), this.wrap.node());
    }
}
