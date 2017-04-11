export default function sort(rows, orderArray) {
    rows.sort(function(a,b) {
            let order = 0;

            orderArray
                .forEach(item => {
                    const acell = a.cells.filter(d => d.col === item.variable)[0].text;
                    const bcell = b.cells.filter(d => d.col === item.variable)[0].text;

                    if (order === 0) {
                        if (
                            (item.direction ===  'ascending' && acell < bcell) ||
                            (item.direction === 'descending' && acell > bcell))
                                order = -1;
                        else if (
                            (item.direction ===  'ascending' && acell > bcell) ||
                            (item.direction === 'descending' && acell < bcell))
                                order = 1;
                    }
                });

            return order;
        });
}
