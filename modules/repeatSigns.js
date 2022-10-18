function repeatedNotes(staves, rhythmsTwo) {
  let provAll;

  //print(staves)
  //print(rhythms)
  //print(rhythmsTwo)

  rhythms = rhythmMeas;

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  provAll = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //MEASURES
  for (let i = 0; i < scorePart.length; i++){
    //print(scorePart[i]);

    //ELTS
    if (scorePart[i].barline !== undefined) { //IF THERE ARE BARLINES
      //print(i,scorePart[i].barline)

      if(scorePart[i].barline.length !== undefined){  //IF THERE'S MORE THAN ONE DEFINITION
        //print(i,scorePart[i].barline);

        for (let j = 0; j < scorePart[i].barline.length; j++){
          //print(i,scorePart[i].barline[j]);

          if(scorePart[i].barline[j]["bar-style"] == undefined){  //IF WE HAVE A BOX...
            //print(i,scorePart[i].barline[j])
            let box = scorePart[i].barline[j].ending["@number"];
            //print(box)

            //STAVES
            for (let k = 0; k < rhythms.length; k++){
              //print(rhythms[k])

              //VOICES
              for (let l = 0; l < rhythms[k].length; l++){
                //print(rhythms[k][l]);

                //ELTS
                for (let m = 0; m < rhythms[k][l].length; m++){
                  //print(rhythms[k][l][m]);

                  if(rhythms[k][l][m][2] == i){
                    provAll[k][l].push([ rhythms[k][l][m][0], "box no."+box ])
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  //print(provAll)

  //ATTRIBUTE ELTS
  for (let i = 0; i < attribute.length; i++){
    //print(attribute[i])

    for (let j = 0; j < attribute[i].length; j++){
      //print(attribute[i][j]);
      if (attribute[i][j]["measure-repeat"] !== undefined) {  //IF THERE IS AN REPEAT ELEMENT
        //print(scorePart[i].attributes["measure-repeat"])

        if (attribute[i][j].attributes["measure-repeat"]["@type"] == "start") {  //ONLY THE START

          for (let k = 0; k < rhythms[0][0].length; k++){
            //print(rhythms[0][0][k]);

            if(rhythms[0][0][k][2] == i){
              //print(rhythms[0][0][k]);
              provAll[0][0].push([ rhythms[0][0][k][0],"measure-repeat" ]);
              break
            }
          }
        }
      }
    }
  }

  //DIRECTION ELTS
  for (let i = 0; i < direction.length; i++){
    //print(direction[i]);

    for (let j = 0; j < direction[i].length; j++){
      //print(direction[i][j]);

      //CODA
      if(direction[i][j].coda !== undefined){
        //print(i,direction[i][j]);

        for (let k = 0; k < rhythms[0][0].length; k++){
          //print(rhythms[0][0][k]);

          if(rhythms[0][0][k][2] == i){
            //print(rhythms[0][0][k]);
            provAll[0][0].push([ rhythms[0][0][k][0],"coda" ]);
            break
          }
        }
      }

      //SEGNO
      if(direction[i][j].segno !== undefined){
        //print(direction[i][j]);

        for (let k = 0; k < rhythms[0][0].length; k++){
          //print(rhythms[0][0][k]);

          if(rhythms[0][0][k][2] == i){
            //print(rhythms[0][0][k]);
            provAll[0][0].push([ rhythms[0][0][k][0],"segno" ]);
            break
          }
        }
      }

      //WORDS
      if (direction[i][j].words !== undefined && direction[i][j].words.__text !== undefined) {
        //print(direction[i][j].words)
        if (repWords.includes(direction[i][j].words.__text.toLowerCase() )) {
          //print(direction[i][j].words["__text"])

          for (let k = 0; k < rhythms[0][0].length; k++){
            //print(rhythms[0][0][k]);

            if(rhythms[0][0][k][2] == i){
              //print(rhythms[0][0][k]);
              provAll[0][0].push([ rhythms[0][0][k][0], direction[i][j].words.__text ]);
              break
            }
          }
        }
      }
    }
  }
  //print(provAll)

  //TODO WHAT HAPPENS IF THERE'S THREE ELTS PER INDEX...

  //STAVES
  for (let i = 0; i < provAll.length; i++) {
    //print(provAll[i]);
    let newArr = [];

    //VOICES
    for (let j = 0; j < provAll[i].length; j++){
      //print(provAll[i][j]);

      if(provAll[i][j].length > 0){
        provAll[i][j].sort(function(a,b) {
          return a[0]-b[0]
        });
      }
      //print(provAll[i][j])

      //ELTS
      for (let k = 0; k < provAll[i][j].length; k++){
        //print(provAll[i][j][k])

        if (provAll[i][j][k+1] !== undefined) {  //IF THERE'S NEXT ELT
          //print(provAll[i][j][k][0],provAll[i][j][k+1][0])

          if (provAll[i][j][k][0] == provAll[i][j][k+1][0]) { //IF ACTUAL ELT IS THE SAME AS THE NEXT
            //print(provAll[i][j][k][0])
            //print("duplis");

            newArr = provAll[i][j][k].concat(provAll[i][j][k+1]);
            newArr = [...new Set(newArr)]
            all[i][j].push(newArr)
            k++;
          } else{
            all[i][j].push(provAll[i][j][k])
          }
        } else {
          all[i][j].push(provAll[i][j][k])
        }
      }
    }
  }

  let accumY;
  for (let i = 0; i < rhythmsTwo.length; i++) {
    //print(accumX[i])

    for (let j = 0; j < rhythmsTwo[i].length; j++) {
      //print(accumX[i][j]);

      accumY = Array.from(all[i][j], (x) => x[0]);
      //print(accumY);

      if(accumY.length > 0){

        for (let k = 0; k < rhythmsTwo[i][j].length; k++) {
          //print(rhythmsTwo[i][j][k])

          for (let l = 0; l < rhythmsTwo[i][j][k]; l++) {
            //print(l+1);
            if (accumY.includes(l + 1)) {
              //print('yes rep')
            } else {
              //print(l+1,"none");
              all[i][j].push([l + 1, "none"]);
            }
          }
        }
      }
    }
  }

  for (var z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all)
  return all; //all: MEASURE-INDEXtypes
}
