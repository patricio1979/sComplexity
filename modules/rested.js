function restedNotes(staves) {

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  accumX = Array.from(Array(staves), () => new Array([0], [0], [0], [0])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //print(note[0])

  for (let a = 0; a < note.length; a++) {
    //print(note[a])

    for (let b = 0; b < note[a].length; b++) {
      //print(note[a][b])

      if (note[a][b].grace == undefined){ //EXCLUDE GRACE NOTES
        //print('no grace')

        if (note[a][b].chord === undefined) { //EXCLUDE CHORDS
          accumX[Math.ceil( (note[a][b].voice / 4) - 1)][ (note[a][b].voice - 1) % 4 ][0]++;
          //print(note[a][b]);

          if (note[a][b].rest !== undefined) {  //IF THERE ARE RESTS
            all[Math.ceil(note[a][b].voice / 4) - 1][ (note[a][b].voice - 1) % 4 ].push([
              accumX[Math.ceil(note[a][b].voice / 4) - 1][ (note[a][b].voice - 1) % 4][0], 1 ]);

            } else {  // IF NOT REST IN THE NOTE
              all[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4 ].push([
                accumX[Math.ceil(note[a][b].voice / 4) - 1][ (note[a][b].voice - 1) % 4 ][0], 0 ]);
              }

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
