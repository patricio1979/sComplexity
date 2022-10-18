function intervalP(pClass, staves, mruNum) {
  let ind = 0, act = 0;

  barBool = true; //CHANGES THE WAY THAT THE htp FUNCTION WORKS

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  // accumX = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //print(pClass);

  //STAVES
  for (let a = 0; a < pClass.length; a++) {
    //print(pClass[a]);

    //VOICES
    for (let b = 0; b < pClass[a].length; b++) {
      //print(pClass[a][b]);

      if (b == 0){  //ONLY RESET INTERVAL WHEN VOICE 1
        ind = 0;
      }

      //ELTS
      for (let c = 0; c < pClass[a][b].length; c++) {
        //print(a,b,pClass[a][b][c][2]);

        if (pClass[a][b][c][1] !== 0) { //IF IT'S NOT SILENCE
          //print(a,b,pClass[a][b][c])

          act = abs(pClass[a][b][c][1] - ind);
          //print(a,b,act)

          all[a][b].push([ pClass[a][b][c][3], act ]);

          ind = pClass[a][b][c][1];
        }
      }
    }
  }

  for (let z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all,mruNum)
  return all;
}
