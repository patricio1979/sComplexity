function fermattedNotes(staves) {

  all = Array.from(Array(nStaves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  accumX = Array.from(Array(staves), () => new Array([0], [0], [0], [0])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  for(let a = 0; a < note.length; a++){
    //print(note[a])

    for(let b = 0; b < note[a].length; b++){
      //print(note[a][b])

      if (note[a][b].chord === undefined) {
        //IF !CHORD AUGMENT ACCUM
        //accum++;
        accumX[Math.ceil(note[a][b].voice/4)-1][(note[a][b].voice - 1) % 4][0]++;

        if (note[a][b].notations !== undefined && note[a][b].notations.fermata !== undefined) { //IF FERMATA EXISTS

          all[Math.ceil(note[a][b].voice/4)-1][(note[a][b].voice - 1) % 4].push([
            accumX[Math.ceil(note[a][b].voice/4)-1][(note[a][b].voice - 1) % 4][0],note[a][b].notations.fermata["@type"]]);
        }
      }
    }
  }

  let accumY;
  for (let aa = 0; aa < accumX.length; aa++) {
    //print(accumX[aa])
    for (let ab = 0; ab < accumX[aa].length; ab++) {
      //print(accumX[aa][ab]);
      accumY = Array.from(all[aa][ab], (x) => x[0]);
      //print(accumY);
      for (let ac = 0; ac < accumX[aa][ab].length; ac++) {
        //print(accumX[aa][ab][ac])
        for (let ad = 0; ad < accumX[aa][ab][ac]; ad++) {
          //print(ad+1);
          if (accumY.includes(ad + 1)) {
            //print('si fermata')
          } else {
            //print(ad+1,"no fermata");
            all[aa][ab].push([ad+1, "none"]);
          }
        }
      }
    }
  }

  for (let z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all);
  return all; //all: STAFF-VOICE-INDEXtrue/INDEXfalse
}
