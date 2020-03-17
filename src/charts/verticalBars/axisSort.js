export default function axisSort(a, b, type) {
    var alpha = a.key < b.key ? -1 : 1;
    if (type == 'Alphabetical') {
        return alpha;
    } else if (type == 'Descending') {
        return a.prop_n > b.prop_n ? -2 : a.prop_n < b.prop_n ? 2 : alpha;
    } else if (type == 'Ascending') {
        return a.prop_n > b.prop_n ? 2 : a.prop_n < b.prop_n ? -2 : alpha;
    }
}
