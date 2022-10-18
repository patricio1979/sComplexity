function alteredNotes(staves) {

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  accumX = Array.from(Array(staves), () => new Array([0], [0], [0], [0])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //print(note);

  for (let a = 0; a < note.length; a++) {
    //print(note[a])

    for (let b = 0; b < note[a].length; b++) {
      //print(note[a][b])

      if (note[a][b].chord == undefined) { //EXCLUDE CHORD FOR INDEXING
        accumX[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4][0]++;
      }

      if (note[a][b].rest == undefined){  //EXCLUDE CHORD FOR MEASURING

        if (note[a][b].accidental !== undefined) {  //CHECK IF THERE ARE ACCIDENTAL INDICATIONS
          //print(note[a][b].accidental)
          let str = note[a][b].accidental;

          if (note[a][b].accidental["@parentheses"] !== undefined){
            //print(a,b,'parentheses')
            str += ' parentheses';
          }

          all[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4].push([
            accumX[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4][0],str]);

          } else if (note[a][b].notations !== undefined
            &&note[a][b].notations["accidental-mark"] !== undefined) {  //IF THERE ARE ANOTHER ACCIDENTALS (I.E. FIGURED BASS)
              all[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4].push([
                accumX[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4][0],note[a][b].notations["accidental-mark"]]);

              } else {  //IF THERE AREN'T ACCIDENTALS
                all[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4].push([
                  accumX[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4][0],"none"]);
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
