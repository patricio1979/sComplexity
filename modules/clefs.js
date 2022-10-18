function clefs(staves, xPos) {  //rhythmMeas IS EQUAL TO rhytmsTwo
  var xPosVals = [],
  octave,
  clefs = [], ranges;

  //print(staves);
  //print(xPos);
  //print(rhythmMeas);

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  accumX = [...Array(staves)].map(e => Array()); //ARRAY FOR EACH STAFF, WITHOUT VOICES, THEY WILL JOIN;
  ranges = [...Array(staves)].map(e => Array()); //ARRAY FOR EACH STAFF, WITHOUT VOICES, THEY WILL JOIN;

  //MEASURES AND IF ELTS IN THEM
  for (var a = 0; a < attribute.length; a++) {
    //print(attribute[a])

    //DEFINITIONS
    for (var b = 0; b < attribute[a].length; b++) {
      //print(a,b,attribute[a][b]);

      if (attribute[a][b] !== undefined && attribute[a][b].clef !== undefined) {
        //print(attribute[a][b].clef,attribute[a][b].measure)

        if (attribute[a][b].clef.length !== undefined) {
          //print(attribute[a][b].clef)

          for (let i = 0; i < attribute[a][b].clef.length; i++) {
            //print(attribute[a][b])
            clefs.push([ a, attribute[a][b].clef[i] ]);
          }
        } else {
          //print(attribute[a][b].clef)
          clefs.push([ a, attribute[a][b].clef ]);
        }
      }
    }
  }
  //print(clefs);
  for (var oh = 0; oh < clefs.length; oh++) {
    //print(clefs[oh]);

    if (clefs[oh][1]["clef-octave-change"] !== undefined) { //IF THERE'S AN OCTAVE CHANGE
      octave = clefs[oh][1]["clef-octave-change"];
    } else {
      octave = "0";
    }

    if(clefs[oh][0] == 0){
      if (clefs[oh][1]["@number"] !== undefined){
        xPosVals = [0,0,1,int(clefs[oh][1]["@number"])];
      } else {
        xPosVals = [0,0,1,1];
      }
    } else {
      xPosVals = xPosFunc(clefs[oh][1], xPos, int(clefs[oh][0]));
    }
    //print(xPosVals)

    //ARRAY THAT JOINS NOTE INDEX AND CLEF VALUE IN THE EACH STAVE
    accumX[xPosVals[3]-1].push([xPosVals[2],clefs[oh][1].sign + clefs[oh][1].line + octave]);
    ranges[xPosVals[3]-1].push(xPosVals[2]);
  }

  //GO THROUGH EACH SUM FOR SEARCHING CLEFS AND ASSIGN THE OTHERS A TACIT CLEF
  //print(accumX[0][0][0])  //note number (index), clef definition
  //print(rhythmMeas[0][0][3])    //index, rhythmic value, measure, MRU
  //print(ranges)
  let curri = "", curriComp = "", cosi;

  //STAVES
  for (let i = 0; i < rhythmMeas.length; i++){
    //print(i,rhythmMeas[i])

    //VOICES
    for (let j = 0; j < rhythmMeas[i].length; j++){
      //print(i,rhythmMeas[i][j])

      //ELEMENTS
      for (let k = 0; k < rhythmMeas[i][j].length; k++){
        //print(i,rhythmMeas[i][j][k])
        cosi = Math.max(...ranges[i].filter(num => num <= rhythmMeas[i][j][k][0]));
        //print(accumX[i][ranges[i].indexOf(cosi)][1])
        curri = accumX[i][ranges[i].indexOf(cosi)][1];

        if (curriComp == curri){  //COMPARE PREVIOUS CLEF WITH ACTUAL ONE
          all[i][j].push([ rhythmMeas[i][j][k][0],curri+"T" ]);
        } else {
          all[i][j].push([ rhythmMeas[i][j][k][0],curri ]);
        }
        curriComp = curri;
      }
    }
  }

  for (var z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all)
  return all; //CLEFS IN STAFF AND VOICE(ALL ON VOICE 1, JUST FOR PROBABILITIES CALC)
}
