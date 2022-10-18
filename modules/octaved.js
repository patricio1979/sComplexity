function octavedNotes(staves, xPos, accumX) {
  let xPosVals;

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  under = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  for (let a = 0; a < direction.length; a++) {
    //print(direction[a])

    for (let b = 0; b < direction[a].length; b++) {
      //print(direction[a][b])

      if (direction[a][b] !== undefined && direction[a][b]["octave-shift"] !== undefined) {
        //print(direction[a][b]["octave-shift"]);

        xPosVals = xPosFunc(direction[a][b]["octave-shift"], xPos, a);
        under[xPosVals[0]][xPosVals[1]].push([xPosVals[2],direction[a][b]["octave-shift"]["@type"]]);
      }
    }
  }

  for (let zz = 0; zz < under.length; zz++) {
    //print(under[zz])
    under[zz] = under[zz].filter((e) => e.length);
  }
  //print(under);
  for (let aaa = 0; aaa < under.length; aaa++) {
    //print(under[aaa]);

    for (let aab = 0; aab < under[aaa].length; aab++) {
      //print(under[aaa][aab]);

      for (let aac = 0; aac < under[aaa][aab].length; aac++) {  //AVOID UNIQUE INDICATIONS IN THE SAME NOTE

        if (under[aaa][aab][aac][1] !== "stop") {
          //print(under[aaa][aab][aac]);

          for (let aad = 0; aad < under[aaa][aab][aac + 1][0] - under[aaa][aab][aac][0] + 1; aad++) {
            //print(under[zz][0] + a)
            all[aaa][aab].push([
              under[aaa][aab][aac][0] + aad,
              under[aaa][aab][aac][1],
            ]);
          }
        }
      }

      //print(all[aaa][aab]);
      let accumY = Array.from(all[aaa][aab], (x) => x[0]);
      //print(accumY)
      for (let aae = 1; aae < accumX[aaa][aab][0] + 1; aae++) {
        if (accumY.includes(aae)) {
          //print('si wedge');
        } else {
          //print('no wedge');
          all[aaa][aab].push([aae, "none"]);
        }
        //print(all[aaa][aab][aae]);
      }
      //print(all[aaa][aab])
    }
  }

  for (let z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all);
  return all; //RETURN OCTAVE INDICATION IN EACH STAVE AND VOICE AND NOTE
}
