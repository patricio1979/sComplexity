function barlines(rhythms, mruNum) {

  let current = [], repeat = 0, meas = 0;
  barBool = true; //CHANGES THE WAY THAT THE htp FUNCTION WORKS

  all = Array.from(Array(1), () => new Array([], [], [], []) ); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //print(rhythmMeas);
  //print(mruNum)

  //BUILD ARRAY OF MRUS PER BARLINES
  for (let i = 0; i < rhythmMeas[0][0].length; i++){ //ONLY ON VOICE ONE, AND THIS COUNTS FOR EACH VOICE ON EACH STAVE
    //print(i,rhythmMeas[0][0][i]);

    if(rhythmMeas[0][0][i][2] !== meas) {
      //print('CAMBIO DE COMPAS')
      //print(i,rhythmMeas[0][0][i]);
      current.push( rhythmMeas[0][0][i-1][3] );
      meas++;
    }

    if(i == rhythmMeas[0][0].length-1){
      //print('final')
      current.push(mruNum-1);
    }
  }
  //print(scorePart.length, current.length)

  //CHECK EACH MEASURE
  for (let i = 0; i < scorePart.length; i++) {
    //print(i,scorePart[i])

    if (scorePart[i].barline !== undefined) { //IF THERE ARE BARLINES
      //print(i,scorePart[i].barline)

      if(scorePart[i].barline.length !== undefined){  //IF THERE'S MORE THAN ONE DEFINITION
        //print(i,scorePart[i].barline);

        for (let j = 0; j < scorePart[i].barline.length; j++){
          //print(scorePart[i].barline[j]);

          if (scorePart[i].barline[j]["bar-style"] !== undefined){  //IF IT'S NOT A REPEAT SIGN
            //print(scorePart[i].barline[j]);

            if(scorePart[i].barline[j].repeat !== undefined){ //CHECK IF THE LINE HAS TWO POINTS INDICATING REPEAT
              repeat = 1;
            } else {
              repeat = 0;
            }

            if(scorePart[i].barline[j].repeat !== undefined && scorePart[i].barline[j].repeat["@direction"] !== "forward"){
              //print(scorePart[i].barline.repeat["@direction"])
              repeat = 1+' + normal';
            }

            all[0][0].push([ current[i], scorePart[i].barline[j]["bar-style"]+repeat ])

          }
        }
      } else {  //IF THERE'S ONLY ONE BARLINE DEFINITION
        //print(i,scorePart[i].barline.repeat);

        if(scorePart[i].barline.repeat !== undefined){ //CHECK IF THE LINE HAS TWO POINTS INDICATING REPEAT
          //print(i,scorePart[i].barline.repeat["@direction"])
          repeat = 1;
        } else {
          repeat = 0;
        }

        if(scorePart[i].barline.repeat !== undefined && scorePart[i].barline.repeat["@direction"] !== "forward"){
          //print(scorePart[i].barline.repeat["@direction"])
          repeat = 1+' + normal';
        }

        all[0][0].push([ current[i], scorePart[i].barline["bar-style"]+repeat ])

        //all[0][0].push([ current[i], scorePart[i].barline["bar-style"]+repeat ])
      }
    } else {  //IF THERE'S NO BARLINE DEFINITION, THEN IS NORMAL ACCORDING TO THE MUSICXML FORMAT
      //print(i,scorePart[i]);
      all[0][0].push([ current[i], "normal" ])
    }
  }

  let provis = Array.from( Array(1), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES
  let provisComp = Array.from(Array(1), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES


  for (let i = 0; i < all[0][0].length; i++) {
    //print(all[u]);
    provis[0][0].push(all[0][0][i][0]);
  }
  //print(provis)

  provisComp[0][0] = rhythmMeas[0][0].map(x => x[3]);
  provisComp[0][0] = [...new Set(provisComp[0][0])];
  //print(provisComp[0][0])


  //print(mruNum,provisComp)
  let compare = provisComp[0][0].filter( function(e) { return this.indexOf(e) < 0; },provis[0][0] );
  //print(compare);

  //ELTS
  //GO THROUGH THE ELTS THAT DOES NOT HAVE ANYTHING
  for (let i = 0; i < compare.length; i++) {
    all[0][0].push([ compare[i] , "none"]);
  }

  all[0][0].sort(function(a,b) { return a[0]-b[0] })  //SORT ELEMENTS

  for (let z = 0; z < all.length; z++) {
    //print(all[z])
    all[z] = all[z].filter((e) => e.length);
  }

  //print(all)
  return all;
}
