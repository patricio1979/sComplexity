function sluredNotes(staves) {
  let under = [], one = 0, two = 0;

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  under = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  accumX = Array.from(Array(staves), () => new Array([0], [0], [0], [0])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //ELTS
  for (let a = 0; a < note.length; a++) {
    //print(note[a])


    //DEFINITIONS
    for (let b = 0; b < note[a].length; b++) {
      //print(note[a][b])
      one = Math.ceil(note[a][b].voice / 4) - 1;
      two = (note[a][b].voice - 1) % 4;

      if (note[a][b].chord === undefined && note[a][b].notations !== undefined && note[a][b].notations.slur !== undefined) {
        //print( Math.ceil (note[a][b].voice/4) - 1);
        //print((note[a][b].voice - 1) % 4);
        //print(Math.ceil(note[a][b].voice / 4) - 1,(note[a][b].voice - 1) % 4, sluredTest)
        accumX[one][two]++;
        under[one][two].push(accumX[one][two]);
      } else if (note[a][b].chord === undefined) {
        accumX[one][two]++;
      }
    }
  }
  //print(under);

  for (let zz = 0; zz < under.length; zz++) {
    //print(all[zz])
    under[zz] = under[zz].filter((e) => e.length);
  }

  for (let aaa = 0; aaa < under.length; aaa++) {
    //print(under[aaa]);
    for (let aab = 0; aab < under[aaa].length; aab++) {
      //print(under[aaa][aab]);
      //print(accumX[aaa][aab][0]);
      for (let aac = 0; aac < under[aaa][aab].length; aac += 2) {
        //print(under[aaa][aab][aac]);
        //print( (under[aaa][aab][aac+1] - under[aaa][aab][aac]) + 1); //number of notes covered
        for (let aad = 0; aad < under[aaa][aab][aac + 1] - under[aaa][aab][aac] + 1; aad++ ) {
          //print(under[zz][0] + za)
          all[aaa][aab].push([under[aaa][aab][aac] + aad, 1]);
        }
      }
    }
  }

  let provis = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  let provisComp = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  for (let u = 0; u < all.length; u++) {

    for (let uu = 0; uu < all[u].length; uu++) {
      //print(all[u][uu]);

      for (let uuu = 0; uuu < all[u][uu].length; uuu++) {
        provis[u][uu].push(all[u][uu][uuu][0]);
      }
    }
  }
  //print(provis)

  for (let ut = 0; ut < accumX.length; ut++) {

    for (let uut = 0; uut < accumX[ut].length; uut++) {
      //print(accumX[ut][uut]);

      if (typeof accumX[ut][uut] == "number") {
        provisComp[ut][uut] = Array.from({ length: accumX[ut][uut] },(_, i) => i + 1 );
      }
    }
  }
  //print(provisComp)
  for (let t = 0; t < provis.length; t++) {

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
  return all;
}
