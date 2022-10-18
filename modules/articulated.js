function articulatedNotes(staves) {

  // Notations implemented are:
  // <accent> <strong-accent> <staccato> <tenuto> <detached-legato> <staccatissimo> <spiccato> <scoop> <plop> <doit> <falloff>
  // <breath-mark> <caesura> <stress> <unstress> <soft-accent> <other-articulation>
  //
  // https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/articulations/

  all = Array.from(Array(nStaves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  accumX = Array.from(Array(staves), () => new Array([0], [0], [0], [0])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  let one, two;
  //print(staves)

  for (let a = 0; a < note.length; a++) {
    //print(note[a])

    for (let b = 0; b < note[a].length; b++) {
      //print(note[a][b])

      if (note[a][b].chord === undefined) { //IF !CHORD AUGMENT ACCUM
        //print(note[a][b])

        one = Math.ceil(note[a][b].voice / 4) - 1;
        two = (note[a][b].voice - 1) % 4;

        accumX[one][two][0]++;

        if (note[a][b].notations !== undefined && note[a][b].notations.articulations !== undefined) {
          //print(Object.keys (note[a][b].notations.articulations)[0])
          all[one][two].push([ accumX[one][two][0], Object.keys(note[a][b].notations.articulations)[0] ]);
        }
      }
    }
  }

  let accumY;
  //STAVES
  for (let aa = 0; aa < accumX.length; aa++) {
    //print(accumX[aa])

    //VOICES
    for (let ab = 0; ab < accumX[aa].length; ab++) {
      //print(accumX[aa][ab]);

      accumY = Array.from(all[aa][ab], (x) => x[0]);
      //print(accumY);

      //ELTS
      for (let ac = 0; ac < accumX[aa][ab].length; ac++) {
        //print(accumX[aa][ab][ac])

        for (let ad = 0; ad < accumX[aa][ab][ac]; ad++) {
          //print(ad+1);

          if (accumY.includes(ad + 1)) {
            //print('yes articulated')
          } else {
            //print(ad+1,"none");
            all[aa][ab].push([ad + 1, "none"]);
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
  return all; //all: STAFF-VOICE-INDEXtype/INDEXfalse
}
