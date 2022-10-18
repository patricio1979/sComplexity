function pitchedNotes(staves) {
  let pitchClassMIDI = {
      C: 0,
      D: 2,
      E: 4,
      F: 5,
      G: 7,
      A: 9,
      B: 11,
    },
    alter,
    octave,
    step,
    xPos, //FOR LOCATING DIRECTION ELEMENTS
    one, two,
    voice, type;

  //FIRST BUILD AN ARRAY WITH STAVES
  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  xPos = Array.from(Array(staves), () => new Array([], [], [], []));
  accumX = Array.from(Array(staves), () => new Array([0], [0], [0], [0])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //print(xPos)

  //STAVES
  for (let a = 0; a < note.length; a++) {
    //print(a,note[a])
    voice = false;

    //ELTS
    for (let b = 0; b < note[a].length; b++) {
      //print(note[a][b].voice - 1)

      //IF NOT CHORD AUGMENT accumX
      if (note[a][b].chord == undefined) {
        //CHECK IF !CHORD AND !REST
        one = Math.ceil(note[a][b].voice / 4) - 1;
        two = (note[a][b].voice - 1) % 4;

        accumX[one][two][0]++;
      }

      //IF NOT CHORD NOR REST FOR XPOS
      if (note[a][b].chord == undefined && note[a][b].rest == undefined) {
        //CHECK IF !CHORD AND !REST FOR BUILDING XPOS WITH ALL DEFAULT-X FOR DIRECTION AND ATTRIBUTE ELEMENTS
        //print(Math.ceil(note[a][b].voice / 4) - 1,note[a][b].voice - 1)
        xPos[one][two].push([int(a),accumX[one][two][0],float(note[a][b]["@default-x"])]);
      }

      //PITCH
      if (note[a][b].pitch !== undefined) { //CHECK IF !REST FOR PITCH INFORMATION

        if (note[a][b].grace !== undefined){
          //print('grace')
          type = 'y';
        } else if (note[a][b].chord !== undefined){
          //print('chord')
          type = 'n';
        } else {
          type = 'y';
        }

        step = pitchClassMIDI[note[a][b].pitch.step];
        octave = int(note[a][b].pitch.octave) * 12;

        if (note[a][b].pitch.alter !== undefined) {
          alter = int(note[a][b].pitch.alter);
        } else {
          alter = 0;
        }

        all[one][two].push([accumX[one][two][0],step + octave + alter,type]);
      } else {  //IF REST NOTE
        //print(note[a][b])
        all[one][two].push([accumX[one][two][0],0,'y']);
      }

      if(int(note[a][b].voice) !== 1 && int(note[a][b].voice) !== 5 && int(note[a][b].voice) !== 9 && int(note[a][b].voice) !== 13){
        voice = true;
      }
    }
    if(voice){
      for(let i = 0; i < staves; i++){
        for(let j = 0; j < 3; j++){
          accumX[i][j+1][0]++;
          all[i][j+1].push([accumX[i][j+1][0],0]);
        }
      }
    }
  }

  for (let z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter(e => e.length >= note.length);
  }

  for (let zzz = 0; zzz < xPos.length; zzz++) {
    //print(all[z])
    xPos[zzz] = xPos[zzz].filter((e) => e.length);
  }

  //print(xPos);
  //print(all)
  return [all, xPos];
  /*
  all:STAFF-VOICE-INDEX,MIDI CLASS => ALL NOTES IN THE PART WITH RESTS
  xPos:MEASURE-VOICE-NOTE X POSITION => ALL POSITIONS IN MEASURE'S NOTE (NOT SILENCE NOR CHORDS) FOR CONECTING <direction> ELEMENTS
  */
}
