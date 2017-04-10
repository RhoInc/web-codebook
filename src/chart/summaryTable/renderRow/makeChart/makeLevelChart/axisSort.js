export default function axisSort(a,b,type){
  var alpha = a.key < b.key ? -1 : 1
  if(type=="alpha"){
    return alpha
  }else if(type=="desc"){
    return a.prop_n > b.prop_n ? -2 :
      a.prop_n < b.prop_n ?  2 : alpha
  }else if(type=="asc"){
    return a.prop_n > b.prop_n ? 2 :
      a.prop_n < b.prop_n ?  -2 : alpha
  }
}
