export default function makeTitle(d) {
	var wrap = d3.select(this)


	var title = wrap.append('div').html(d=>d.value_col)

	//add a short summary
	var summary_text = d.type == 'categorical' ? ' '+d.type + ' variable with '+d.statistics.values.length+' levels' : ' '+d.type + ' variable'
	var summary_text_span = title.append('span')
	.attr('class','small')
	.text(summary_text)

	if(d.type == 'categorical'){
		var value_list = d.statistics.values.map(m=>m.key+': '+d3.format('0.1%')(m.prop_n))
		var nValues = value_list.length;
		value_list = value_list.slice(0,10).join('\n')
		value_list = nValues > 10 ?
			value_list + '\nAnd '+(nValues-10)+' more.':
			value_list

		summary_text_span.append('sup')
		.html('?')
		.style('cursor','pointer')
		.attr('title',value_list)
	}
}
