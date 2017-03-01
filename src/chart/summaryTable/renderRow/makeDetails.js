export default function makeDetails(d) {
    var wrap = d3.select(this)

  //Render Summary Stats
    var stats_div = wrap.append('div').attr('class', 'stat-row')
    var statNames = Object.keys(d.statistics).filter(f => f!='values')
    var statList = statNames
        .map(stat => {
            return {
                key: stat !== 'nMissing' ? stat : 'Missing', 
                value: d.statistics[stat]};
        })
        .filter(statItem => ['N', 'n'].indexOf(statItem.key) === -1);

  //Render Values 
    if (d.type == 'categorical') {
        var stats = stats_div
            .selectAll('div')
                .data(statList)
                .enter()
            .append('div')
            .attr('class', 'stat');
        stats.append('div').text(d=>d.key).attr('class', 'label');
        stats.append('div').text(d=>d.value).attr('class', 'value');
    } else if (d.type === 'continuous') {
        var stats = stats_div
            .selectAll('div')
                .data(statList.filter(statItem => statItem.key.indexOf('ile') === -1))
                .enter()
            .append('div')
            .attr('class', 'stat')
        stats.append('div').text(d=>d.key).attr('class', 'label')
        stats.append('div').text(d=>d.value).attr('class', 'value')
    }
}
