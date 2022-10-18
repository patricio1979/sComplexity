function expressedNotes(staves, xPos, rhythms) {
  let words = exprWords,
  xPosVals;

  //print(rhythms)
  //print(words)

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //ELTS
  for (let a = 0; a < direction.length; a++) {
    //print(a,direction[a])

    //DEFINITIONS
    for (let b = 0; b < direction[a].length; b++) {
      //print(direction[a][b])

      if (direction[a][b] !== undefined && direction[a][b].words !== undefined && direction[a][b].words.__text !== undefined) {
        //print(direction[a][b].words.__text)

        if (words.includes( direction[a][b].words.__text.toLowerCase() )) {
          //print(direction[a][b].words.__text)
          //print(direction[a][b].words["@default-x"])

          if(direction[a][b].words["@default-x"] == "0"){
            xPosVals = [0,0,1,0];
          } else {
            xPosVals = xPosFunc(direction[a][b].words, xPos, a);
            //print( all[xPosVals[0]][xPosVals[1]] );
            all[xPosVals[0]][xPosVals[1]].push([ xPosVals[2], direction[a][b].words.__text ]);
          }

          if(xPosVals.length > 4){
            all[xPosVals[4]][xPosVals[5]].push([ xPosVals[6], direction[a][b].words.__text ]);
          }
          //print(xPosVals)
        }
      }
    }
  }

  let provis = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  let provisComp = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  for (var u = 0; u < all.length; u++) {
    for (var uu = 0; uu < all[u].length; uu++) {
      //print(all[u][uu]);
      for (var uuu = 0; uuu < all[u][uu].length; uuu++) {
        provis[u][uu].push(all[u][uu][uuu][0]);
      }
    }
  }
  //print(provis)
  for (var ut = 0; ut < rhythms.length; ut++) {
    for (var uut = 0; uut < rhythms[ut].length; uut++) {
      //print(accumX[ut][uut]);
      provisComp[ut][uut] = Array.from({ length: rhythms[ut][uut][0] }, (_, i) => i + 1 );
    }
  }
  //print(provisComp)
  for (var t = 0; t < provis.length; t++) {
    for (var tt = 0; tt < provis[t].length; tt++) {
      //print(provis[t][tt].length)
      if (provis[t][tt].length > 0) {
        let compare = provisComp[t][tt].filter((i) => {
          return provis[t][tt].indexOf(i) < 0;
        });
        //print(compare);
        for (var ttt = 0; ttt < compare.length; ttt++) {
          all[t][tt].push([compare[ttt], 'none']);
        }
      }
    }
  }

  for (let z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all);
  return all;
}
