function ornamTrill(staves) {
  let wavyLine = false;

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  accumX = Array.from(Array(staves), () => new Array([0], [0], [0], [0])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  for (let a = 0; a < note.length; a++) {
    //print(note[a])

    for (let b = 0; b < note[a].length; b++) {
      //print(note[a][b]);
      let one = Math.ceil(note[a][b].voice / 4) - 1, two = (note[a][b].voice - 1) % 4;

      if (note[a][b].chord == undefined) { //EXCLUDE CHORDS FOR MEASURES / IF !CHORD AUGMENT ACCUM
        accumX[Math.ceil(note[a][b].voice / 4) - 1][(note[a][b].voice - 1) % 4][0]++;

        if (note[a][b].rest == undefined) {  //EXCLUDE RESTS
          //print(note[a][b])

          if(note[a][b].grace !== undefined){ //IF NOTE IS GRACE OR ACCACIATURA
            all[one][two].push([accumX[one][two][0],'grace']);
          } else {  //IF NOT...

            if (note[a][b].notations !== undefined && note[a][b].notations.ornaments !== undefined) { //IF ORNAMENTS EXISTS
              //print(a,note[a][b].voice,Object.keys(note[a][b].notations.ornaments));

              for (let c in Object.keys(note[a][b].notations.ornaments) ){
                //print(a,b,Object.keys(note[a][b].notations.ornaments)[c]);

                if(Object.keys(note[a][b].notations.ornaments)[c] == 'wavy-line'){
                  //print(note[a][b].notations.ornaments["wavy-line"])
                  if(note[a][b].notations.ornaments["wavy-line"].length > 1){
                    //print(note[a][b].notations.ornaments["wavy-line"][0])
                    wavyLine = true;
                  } else if(note[a][b].notations.ornaments["wavy-line"]['@type'] == 'start') {
                    //print(note[a][b].notations.ornaments["wavy-line"])
                    wavyLine = true;
                  } else {
                    wavyLine = false;
                  }
                } else {
                  wavyLine = false;
                }

                if(wavyLine){
                  all[one][two].push([accumX[one][two][0],Object.keys(note[a][b].notations.ornaments)[c] + ' WL' ]);
                } else {
                  all[one][two].push([accumX[one][two][0],Object.keys(note[a][b].notations.ornaments)[c] ]);
                }
              }

            } else { //IF THERE AREN'T ORNAMENTS
              //print(a,b,'none')
              all[one][two].push([accumX[one][two][0],'none' ]);
            }
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
  return all;
}
