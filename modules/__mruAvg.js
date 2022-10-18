function mru(staves) {
  //print(tactus)
  //print(scorePart)

  let timeSig = [], timeS, tempi = undefined, factorNuevo = [];
  mruDur = 0, mruCount = 0, mruAvg = 0, quarterDur = 0, n = 1/64;

  all = Array.from(Array(staves), () => new Array([], [], [], [])); //ARRAY FOR EACH STAFF, EACH ONE CONTAINING 4 SLOTS FOR VOICES

  //MEASURES
  for(let i = 0; i < scorePart.length; i++){
    //print(scorePart[i]);

    //IPARSE AND ACCUM TIME SIGNATURES IN EACH MEASURE
    if (scorePart[i].attributes !== undefined && scorePart[i].attributes.time !== undefined) {
      timeS = [ int(scorePart[i].attributes.time.beats),1 / scorePart[i].attributes.time["beat-type"] ];
    }
    timeSig.push(timeS);
  }
  //print(timeSig);
  //print(tempoList);
  //print(rhythmMeasAcc.length)
  //print(metroList)

  let currSpeedArray = new Array(rhythmMeasAcc.length).fill(0);

  //CALCULATE THE MRU ABSTRACT FACTOR, THE NUMBER OF MRUS IN THE SCORE AND THE ABSOULTE DURATION OF EACH MRU
  for (let i = 0; i < rhythmMeasAcc.length; i++) {
    //print(fig[metroList[i][2]])
    //print(rhythmMeasAcc[i])

    //CORRECT THE SUM OF IRRATIONAL AND TUPLET SUBDIVISIONS
    rhythmMeasAcc[i] = Math.round(rhythmMeasAcc[i] / n) * n;

    if ( (timeSig[i][0]/3) % 1 == 0 && timeSig[i][0] != 3 && metroList[i][2] == 0){ //IF THE MEASURE HAS TIME SIGNATURE WITH TERNARY COMPLEX, WE ADD A DOT TO TEMPO
      //print(timeSig[i],metroList[i][2], fig[metroList[i][0]], (60000/tempoList[i]) * 1.5)
      quarterDur = (60000 / tempoList[i]) * ( (fig[metroList[i][0]]*1.5) / 0.25); //tempo in BPMs, METRONOME FIG MODIFIES IT and it could be dotted
    } else {
      quarterDur = (60000 / tempoList[i]) * (fig[metroList[i][0]] / 0.25); //tempo in BPMs, METRONOME FIG MODIFIES IT and it could be dotted
    }
    //print(quarterDur)

    currSpeedArray[i] = quarterDur ; //currSpeed IS THE DURATION IN ms OF BEAT in MEASURE

    //WE ARE ASSUMING THAT IF IT IS BINARY IT HAS THE DENOMINATOR AS PULSE, BUT IF IT IS ternary
    //THE PULSE IS 3 IF IT IS SIMPLE OR SIX EIGHTS FOR MORE LIKE 6/8 IS 0.375, ALSO AS IN 9/8 IS 0.375

    if ( (timeSig[i][0] / 3) % 1 == 0 && timeSig[i][0] != 3 ) { //IF IT'S TERNARY MULTIPLE
      //print('terny')
      if          (tactus==0){  //------------0
        factorNuevo.push(rhythmMeasAcc[i]); //WHOLE MEASURE ABSTRACT FACTOR
        mruDur += (currSpeedArray[i]/3) * ( rhythmMeasAcc[i] / timeSig[i][1] ); //ABSOLUTE DURATION OF THE MEASURE
        mruCount++; //ADVANCE ONE MRU PER MEASURE
      } else if   (tactus==1){  //------------1
        //TODO: COMPLICATED TO EVALUATE THE AMOUNT OF ACCENTS. USER MUST PUT THIS INFO...
      } else if   (tactus==2){  //------------2

        if ( (rhythmMeasAcc[i] / (timeSig[i][1]*3) ) % 1 == 0) { //IF THE DURATION OF MEASURE ITS DIVISIBLE BY ITS MEASURE DENOMINATOR

          for (let j = 0; j < (rhythmMeasAcc[i] / (timeSig[i][1]*3)); j++) {
            //print(rhythmMeasAcc[i] / (timeSig[i][1]*3),(timeSig[i][1]*3), currSpeedArray[i])
            //print(timeSig[i][1]*3)
            //print(currSpeedArray[i])
            factorNuevo.push(timeSig[i][1]*3);  //WE ADD AS MANY DENOMINATORS ITS DIVISION EVALUATES
            mruDur += currSpeedArray[i]; //WE ADD AS MANY SPEED ITS DIVISION EVALUATES
            mruCount++; //ACCUMULATE A MRU PER PULSE
          }
        } else {  //IF WE HAVE A PICKUP BAR OR ITS COMPLEMENT, OR MEASURE ITS NON DIVISIBLE BY ITS DENOMINATOR...

          for ( let j = 0; j < (rhythmMeasAcc[i] / (timeSig[i][1]*3)); j++) {
            factorNuevo.push(rhythmMeasAcc[i] / (timeSig[i][1]*3)); //WE ADD THE DURATION OF THE MEASURE
            mruCount++;
            mruDur +=  currSpeedArray[i] * (rhythmMeasAcc[i] / (timeSig[i][1]*3));
          }
        }
      }
    } else if (timeSig[i][0] == 3 || (timeSig[i][0] / 2) % 1 == 0 || timeSig[i][0] == 1){  //IF IT'S TERNARY SIMPLE, BINARY OR THERE'S A NUMBER ONE IN THE DENOMINATOR
      //print('simple')
      if          (tactus==0){  //------------0
        factorNuevo.push(rhythmMeasAcc[i]); //THE WHOLE MEASURE
        mruDur += currSpeedArray[i] * ( rhythmMeasAcc[i] / timeSig[i][1] ); //CURRENT SPEED (PULSE SPEED) TIMES THE LENGTH OF THE MEASURE, DIVIDED BY THE LENGTH OF THE PULSE
        mruCount++; //ADVANCE ONE MRU
      } else if   (tactus==1) {  //------------1
        //TODO
      } else if   (tactus==2) {  //------------2

        if ( (rhythmMeasAcc[i] / timeSig[i][1]) % 1 == 0) { //IF THE DURATION OF MEASURE ITS DIVISIBLE BY ITS MEASURE DENOMINATOR

          for (let j = 0; j < (rhythmMeasAcc[i] / timeSig[i][1]); j++) {
            factorNuevo.push(timeSig[i][1]);  //WE ADD AS MANY DENOMINATORS ITS DIVISION EVALUATES
            mruDur +=  currSpeedArray[i]; //WE ADD AS MANY SPEED ITS DIVISION EVALUATES
            mruCount++; //ACCUMULATE A MRU PER PULSE
          }
        } else {  //IF WE HAVE A PICKUP BAR OR ITS COMPLEMENT, OR MEASURE ITS NON DIVISIBLE BY ITS DENOMINATOR...

          for ( let j = 0; j < (rhythmMeasAcc[i] / timeSig[i][1]); j++) {
            factorNuevo.push(rhythmMeasAcc[i] / timeSig[i][1]); //WE ADD THE DURATION OF THE MEASURE
            mruCount++;
            mruDur +=  currSpeedArray[i] * (rhythmMeasAcc[i] / timeSig[i][1]);
          }
        }
      }
    } else {
      print(`Time Signature ${timeSig[i]} not implemented yet`)
    }
  }
  //print(mruCount)

  let measCompare, accumi, currMru, changed = false, accumiComp = false,
  pitchy = [], compare = [], current = 0;

  //STAVES
  for (var i = 0; i < rhythmMeas.length; i++) {
    //print(rhythmMeas[i])

    //VOICES
    for (var j = 0; j < rhythmMeas[i].length; j++) {
      currMru = 0;
      accumi = 0;
      measCompare = 0;

      pitchy = pitchedHisto[0][i][j].filter(i => i[2] == 'y');
      //print(pitchy,rhythmMeas[i][j]);

      //ELTS
      for (var k = 0; k < rhythmMeas[i][j].length; k++) {
        //print(j,rhythmMeas[i][j][k][1]);

        //FIRST ACCUM TO GET TO THE TACTUS LIMIT AND PUSH THE CURRENT MRU IN THE ALL ARRAY
        accumi += rhythmMeas[i][j][k][1];

        //SECOND WE CHECK IF IT BELONGS TO THE SAME MEASURE, IN CASE IT IS ANACRUXIS OR METACRUXIS
        if(int(rhythmMeas[i][j][k][2]) != measCompare){
          measCompare++;
          if(accumiComp){
            accumi = 0;
          }
          if(changed){
            currMru++;
          }
        }

        all[i][j].push(currMru);
        rhythmMeas[i][j][k].push(currMru);
        pitchy[k].push(currMru);

        //THIRD, WE CHECK IF ACCUMI HAS ACCUMULATED SO THAT IT FITS IN THE TACTUS, OTHERWISE IT CHANGES DE MRU AND RENEW THE ACCUMI VALUE

        if(accumi >= factorNuevo[currMru]){
          accumi = 0;
          changed = false;
          accumiComp = false;
          currMru++;
        } else {
          changed = true;
          accumiComp = true;
        }
      }
      //print(pitchy)

      for (let l = 0; l < pitchy.length; l++){
        //print( pitchedHisto[0][i][j][k].indexOf(pitchy[i]) )
        compare.push([ pitchedHisto[0][i][j].indexOf(pitchy[l]), pitchy[l][3] ])
      }
      //print(pitchy,compare)

      for (let l = 0; l < pitchedHisto[0][i][j].length; l++){
        compare.forEach((e) => {
          if(e[0] == l){
            current = e[1];
          }
        })

        if(pitchedHisto[0][i][j][l].length < 4){
          pitchedHisto[0][i][j][l].push(current);
        }
      }
    }
  }

  for (var z = 0; z < all.length; z++) {
    all[z] = all[z].filter((e) => e.length);
  }

  //mruDur ACTUALLY IS THE SAME ACCUMULATION IN ALL TACTUS LEVELS...
  mruAvg = mruDur / mruCount;
  //print(mruAvg)

  bitsMRU = new Array(mruCount).fill(0);  //FOR UPDATING EACH ENTROPY MEASUREMENT

  //print(mruDur, mruCount, mruAvg, timeSig, all);
  return [mruDur, mruCount, mruAvg, timeSig, all]; //DURATION OF PART (ACCORDING TO TEMPO AND MEASURE MARKS), AMOUNT OF mrus, AVERAGE DURATION OF mrus, ARRAY WITH TIME SIGNATURES OF PART
}
