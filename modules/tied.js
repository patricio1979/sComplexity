function tiedNotes(staves) {
  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  accumX = Array.from(Array(staves), () => new Array([0], [0], [0], [0])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  for (let a = 0; a < note.length; a++) {
    //print(note[a])
    for (let b = 0; b < note[a].length; b++) {
      //print(note[a][b])

      if (note[a][b].grace == undefined){ //EXCLUDE GRACE NOTES

        if (note[a][b].chord === undefined) { //EXCLUDE CHORD NOTES
          accumX[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4][0]++;
          //print(note[a][b]);

          if (
            note[a][b].notations !== undefined
            && note[a][b].notations.tied !== undefined
            && note[a][b].notations.tied["@type"] == "start") { //ONLY ATTACH START OF TIE
            //print(note[a][b].notations);
            all[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4].push([
              accumX[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4][0],1]);
            } else {
              all[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4].push([
                accumX[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4][0],0]);
              }
            }
          }
        }
      }
      for (var z = 0; z < all.length; z++) {
        //print(all[z])
        all[z] = all[z].filter((e) => e.length);
      }
      //print(all);
      return all;
    }
