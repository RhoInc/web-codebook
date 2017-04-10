export default function onInit() {
  //Add group labels.
    if (this.config.group_col) {
        const groupTitle = this.wrap
            .append('p')
            .text(`${this.config.group_col}: ${this.config.group_val} (n=${this.config.n})`);
        this.wrap.node().parentNode
            .insertBefore(groupTitle.node(), this.wrap.node())
    }
}

