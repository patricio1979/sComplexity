function rhythmedNotes(staves) {

  let proportion = 0, voice, sum = 0;

  rhythmMeasAcc = []; //RESET GLOBAL VARIABLE
  rhythmMeas = [];

  //print(staves)
  //print(measures)

  //FIRST BUILD AN ARRAY WITH STAVES
  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  accumX = Array.from(Array(staves), () => new Array([0], [0], [0], [0])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  //print(accumX)

  rhythmMeas = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //EACH MEASURE
  for (var a = 0; a < note.length; a++) {
    //print(note[a])
    voice = false;
    sum = 0;

    //EACH ELT
    for (var b = 0; b < note[a].length; b++) {
      //print(note[a][b])

      //PASS IF NOT CHORD
      if (note[a][b].chord === undefined) {

        let dot = 1, tupl = 1, noteType = 0, one, two;

        if (note[a][b].rest !== undefined && note[a][b].rest["@measure"] == "yes") {
          noteType = int(note[a][b].duration) * divisions;
        } else {
          noteType = fig[note[a][b].type];
        }

        if (note[a][b].grace !== undefined){  //IF IT IS GRACE NOTE, CERO DURATION
          noteType = 0;
        }

        one = Math.ceil(note[a][b].voice / 4) - 1;
        two = (note[a][b].voice - 1) % 4;

        //1. ACCUM FOR NOTE INDEX
        accumX[one][two][0]++;

        //2. CHECK IF <dot> ELEMENT IS PRESENT FOR FACTOR
        if (note[a][b].dot !== undefined) {
          //print(note[a][b].dot)

          if(note[a][b].dot.length == 0) {
            dot = 1.5;
          } else if(note[a][b].dot.length == 2){
            dot = 1.75;
          } else if (note[a][b].dot.length == 3){
            dot = 1.875;
          }
        } else {
          dot = 1;
        }
        //print(dot)

        //CHECK IF TUPLET
        if (note[a][b]["time-modification"] !== undefined){
          //YES TUPLET
          tupl = note[a][b]["time-modification"]["normal-notes"] / note[a][b]["time-modification"]["actual-notes"];
        }

        all[one][two].push([accumX[one][two][0],dot*tupl*noteType]);
        rhythmMeas[one][two].push([accumX[one][two][0],dot*tupl*noteType,a]);

        if(int(note[a][b].voice) == 1){ //RECOLLECT MEASURE DURATION ONLY FOR VOICE ONE Y STAFF ONE
          sum += dot*tupl*noteType;
        }

        if(int(note[a][b].voice) !== 1 && int(note[a][b].voice) !== 5 && int(note[a][b].voice) !== 9 && int(note[a][b].voice) !== 13){
          voice = true;
        }
      }
    }
    rhythmMeasAcc.push(sum);

    //FOR FOUR STAVES, JUST PUT ON EACH STAVE, CEROS FROM THE VOICE 2 TO THE 4
    if(voice){
      for(let i = 0; i < staves; i++){
        for(let j = 0; j < 3; j++){
          accumX[i][j+1][0]++;
          all[i][j+1].push([accumX[i][j+1][0],sum]);
          rhythmMeas[i][j+1].push([accumX[i][j+1][0],sum,a]);
        }
      }
    }
  }
  //print(rhythmMeasAcc);

  for (var z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter(e => e.length >= note.length);
  }

  for (var zu = 0; zu < rhythmMeas.length; zu++) {
    //print(rhythmMeas[zu])
    rhythmMeas[zu] = rhythmMeas[zu].filter((e) => e.length >= note.length);
  }

  for (let i = 0; i < accumX.length; i++){
    accumX[i] = accumX[i].filter(item => item >= note.length);
  }

  //print(all, accumX, rhythmMeas);
  return [all, accumX, rhythmMeas];
}
