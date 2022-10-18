function dynamics(staves, xPos) {
  let xPosVals = [], xPosValsAccum = [], ranges = [];

  //print(xPos)
  //print(staves)
  //print(rhythmMeas)
  //print(direction)
  //print(dynWords.includes('pianissimo'))

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  accumX = [...Array(staves)].map(e => Array()); //ARRAY FOR EACH STAFF, WITHOUT VOICES, THEY WILL JOIN;
  ranges = [...Array(staves)].map(e => Array()); //ARRAY FOR EACH STAFF, WITHOUT VOICES, THEY WILL JOIN;

  //ALL DIRECTIONS
  for (let a = 0; a < direction.length; a++) {
    //print(direction[a])

    //DETAILS
    for (let b = 0; b < direction[a].length; b++) {
      //print(a,direction[a][b])

      if (direction[a][b].dynamics !== undefined) {
        //print(direction[a][b].dynamics);
        xPosVals = xPosFunc(direction[a][b].dynamics, xPos, int(a));
        //print(xPosVals)
        xPosValsAccum.push([xPosVals.slice(0,4)])

        if(direction[a][b].dynamics['other-dynamics'] !== undefined){
          //print(direction[a][b].dynamics['other-dynamics'])
          accumX[xPosVals[0]].push([xPosVals[2], Object.keys(direction[a][b].dynamics)[0] + direction[a][b].dynamics['other-dynamics'] ]);
          ranges[xPosVals[0]].push(xPosVals[2]);
        } else {
          //print(Object.keys(direction[a][b].dynamics)[0])
          accumX[xPosVals[0]].push([xPosVals[2], Object.keys(direction[a][b].dynamics)[0] ]);
          ranges[xPosVals[0]].push(xPosVals[2]);
        }
      }

      //<words> ELEMENT
      if (direction[a][b].words !== undefined && direction[a][b].words.__text) {
        //print(direction[a][b].words.__text);

        if (dynWords.includes(direction[a][b].words.__text.toLowerCase())) {
          //print(direction[a][b].words["__text"])
          xPosVals = xPosFunc(direction[a][b].words, xPos, a);
          //print(xPosVals)
          xPosValsAccum.push(xPosVals)

          accumX[xPosVals[0]].push([xPosVals[2], direction[a][b].words.__text ]);
          ranges[xPosVals[0]].push(xPosVals[2]);
        }
      }
    }
  }

  // print(xPosValsAccum)
  // print(staves)
  for (let k = 0; k < staves; k++){
    if (!xPosValsAccum.some(a => [0,0,1,0].every((v, i) => v === a[i])) ){
      accumX[k].push([1,defaultDyn]);
      ranges[k].push(1);
    }
  }

  //print(ranges)
  // print(accumX)

  //GO THROUGH EACH SUM FOR SEARCHING DYNAMICS AND ASSIGN THE OTHERS A TACIT T

  let curri = "", curriComp = "", cosi;

  //STAVES
  for (let i = 0; i < rhythmMeas.length; i++){
    //print(i,rhythmMeas[i])

    accumX[i].sort(function(a,b) { return a[0]-b[0] })  //SORT ELEMENTS
    ranges[i].sort(function(a,b) { return a-b })

    //VOICES
    for (let j = 0; j < rhythmMeas[i].length; j++){
      //print(i,rhythmMeas[i][j])

      //ELEMENTS
      for (let k = 0; k < rhythmMeas[i][j].length; k++){
        //print(i,rhythmMeas[i][j][k])

        cosi = Math.max(...ranges[i].filter(num => num <= rhythmMeas[i][j][k][0])); //THIS OPERATION ROUNDS UP TO THE PREVIOUS ELEMENT IN LIST
        //print(cosi)

        curri = accumX[i][ranges[i].indexOf(cosi)][1];

        if (curriComp == curri){  //COMPARE PREVIOUS DYNAMIC WITH ACTUAL ONE
          all[i][j].push([ rhythmMeas[i][j][k][0],curri+"T" ]);
        } else {
          all[i][j].push([ rhythmMeas[i][j][k][0],curri ]);
        }
        curriComp = curri;
      }
    }
  }

  for (let z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all)
  return all; //all: STAFF-VOICE-INDEXtype/INDEXfalse
}
