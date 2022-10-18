function intervalR(rClass, staves) {
  let act = 0;

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //print(rClass);

  //STAVES
  for (let a = 0; a < rClass.length; a++) {

    //VOICES
    for (let b = 0; b < rClass[a].length; b++) {
      //print(rClass[a][b])
      act = 0;

      all[a][b].push([1,0]);

      //ELTS
      for (let c = 1; c < rClass[a][b].length; c++) {
        //print(rClass[a][b][c])

        if (rClass[a][b][c][1] !== 0) {
          //print(rClass[a][b][c])

          act = abs(rClass[a][b][c][1] - rClass[a][b][c - 1][1]);

          all[a][b].push([c+1,act]);
        }
      }
    }
  }

  for (let z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all)
  return all;
}
