function wedgedNotes(staves, xPos, accumX) {
  let xPosVals;

  //print(xPos)
  //print(accumX)
  //print(under)
  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  under = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //ELTS
  for (let a = 0; a < direction.length; a++) {
    //print(direction[a])

    //DEFINITIONS
    for (let b = 0; b < direction[a].length; b++) {
      //print(direction[a][b])

      if (direction[a][b] !== undefined && direction[a][b].wedge !== undefined) {
        //print(direction[a][b].wedge)

        xPosVals = xPosFunc(direction[a][b].wedge, xPos, a);
        //print(xPosVals)

        under[xPosVals[3]-1][xPosVals[1]].push([ xPosVals[2], direction[a][b].wedge["@type"] ]);
        if(xPosVals.length > 4){
          under[xPosVals[3]-1][xPosVals[4]].push([ xPosVals[5], direction[a][b].wedge["@type"] ]);
        }
      }
    }
  }
  //print(under)
  for (let zz = 0; zz < under.length; zz++) {
    //print(under[zz])
    under[zz] = under[zz].filter((e) => e.length);
  }

  for (let aaa = 0; aaa < under.length; aaa++) {
    //print(under[0][aaa]);

    for (let aab = 0; aab < under[aaa].length; aab++) {
      //print(under[aaa][aab]);

      for (let aac = 0; aac < under[aaa][aab].length; aac += 2) {
        //print((under[aaa][aab][aac+1][0] - under[aaa][aab][aac][0]) + 1); //number of notes covered
        for (let aad = 0; aad < under[aaa][aab][aac + 1][0] - under[aaa][aab][aac][0] + 1; aad++) {
          //print(under[zz][0] + a)
          all[aaa][aab].push([ under[aaa][aab][aac][0] + aad, under[aaa][aab][aac][1],]);
        }
      }
    }
  }

  let provis = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  let provisComp = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //PROVIS ARRAY
  for (let u = 0; u < all.length; u++) {
    //print(all[u]);

    for (let uu = 0; uu < all[u].length; uu++) {
      //print(all[u][uu]);

      for (let uuu = 0; uuu < all[u][uu].length; uuu++) {
        provis[u][uu].push(all[u][uu][uuu][0]);
      }
    }
  }
  //print(provis)

  //PROVISCOMP ARRAY
  for (let ut = 0; ut < accumX.length; ut++) {
    //print(accumX[ut]);

    for (let uut = 0; uut < accumX[ut].length; uut++) {
      //print(accumX[ut][uut]);
      provisComp[ut][uut] = Array.from({ length: accumX[ut][uut][0] }, (_, i) => i + 1);
    }
  }
  //print(provisComp);

  //PRO
  for (let t = 0; t < provis.length; t++) {
    //print(provis[t])

    for (let tt = 0; tt < provis[t].length; tt++) {
      //print(provis[t][tt].length)

      if (provis[t][tt].length > 0) {
        let compare = provisComp[t][tt].filter((i) => {
          return provis[t][tt].indexOf(i) < 0;
        });
        //print(compare);
        for (let ttt = 0; ttt < compare.length; ttt++) {
          all[t][tt].push([compare[ttt], 0]);
        }
      }
    }
  }

  for (let z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all);
  return all; //RETURN WEDGE NOTES INDICATION IN EACH STAVE AND VOICE
}
