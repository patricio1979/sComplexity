function keyedNotes() {
  var fifths = "",
    all = [],
    curr = 0,
    perm = 0,
    x;

  for (var a in attribute) {
    //print(attribute[a])
    for (var b in attribute) {
      if (attribute[a][b] !== undefined && attribute[a][b].key !== undefined) {
        //print(attribute[a][b].key)
        fifths = attribute[a][b].key.fifths;
      }
    }
    all.push(fifths);
  }
  //print(all)
  x = histomru(all);
  //print(x)
  for (var zu in x) {
    curr = zu - curr;
    //print(curr)
    perm += Math.abs((curr * x[zu]) / all.length);
    curr = zu;
    //print(curr)
  }
  //print(perm);
  return perm; //RETURN AVERAGE VALUE OF FIFTHS CHANGES. TODO: FIND INDEPENDENT KEY SIGNATURES IN SCORE.
}
