function gatherNotesAccum(score) {

  //print(score)
  //print(note)

  //RESET GLOBAL VARIABLES
  note = [];
  direction = [];
  attribute = [];
  scoreName = "";
  tempoList = [];
  metroList = [];

  //CERO: NAME OF WORK
  let noteMeas = [], items = [], tempoDot = 0, soundTempo = 60, metronome = ['quarter',60,tempoDot];

  if(score["score-partwise"].work !== undefined){
    scoreName = score["score-partwise"].work["work-title"];
  } else {
    scoreName = "untitled";
  }
  //print(scoreName);

  //FIRST: PARSE PARTS IN SCORE
  //print(score["score-partwise"].part)
  if (score["score-partwise"]["part-list"]["score-part"].length !== undefined) {  //IF THERE ARE MORE THAN ONE PART IN THE SCORE

    //INSTRUMENT NAME LIST
    for (let i in score["score-partwise"]["part-list"]["score-part"]) {
      //print(score['score-partwise']['part-list']['score-part'][i])

      if (score["score-partwise"]["part-list"]["score-part"][i]["part-name"] == partName) {
        //print(score["score-partwise"]["part-list"]["score-part"]["@id"])

        id = score["score-partwise"]["part-list"]["score-part"][i]["@id"];

        for (let j in score["score-partwise"].part) {
          //print(score["score-partwise"][j]);

          if (score["score-partwise"].part[j]["@id"] == id) {
            //print(score['score-partwise'].part[ab])
            partId = j;
            //GETTING NUMBER OF STAVES, IS TAKEN FROM THE FIRST MEASURE

            if (score["score-partwise"].part[j].measure[0].attributes.staves !== undefined) {
              //print(score['score-partwise'].part[ab].measure[0].attributes.staves)
              nStaves = int(
                score["score-partwise"].part[j].measure[0].attributes.staves
              );
            } else {
              nStaves = 1;
            }
          }
        }
      }
    }

    scorePart = score["score-partwise"].part[partId].measure;

  } else {  //IF THERE'S ONLY ONE PART
    //print(score["score-partwise"]["part-list"]["score-part"]["@id"]);
    id = score["score-partwise"]["part-list"]["score-part"]["@id"];
    //print(score["score-partwise"].part.measure[0])

    if (score["score-partwise"].part.measure[0].attributes.staves !== undefined) {
      //GETTING NUMBER OF STAVES
      //print(score['score-partwise'].part.measure[0].attributes.staves)
      nStaves = int(score["score-partwise"].part.measure[0].attributes.staves);
    } else {
      nStaves = 1;
    }
    scorePart = score["score-partwise"].part.measure;
  }
  //print(scorePart)

  //SECOND: GATHER ALL ELEMENTS
  for (let a = 0; a < scorePart.length; a++) {
    //print(scorePart[a])

    //GATHER ALL NOTES-------------------<<<
    items = [];
    //print(items)
    if (scorePart[a].note.length == undefined) {  //IF THERE'S ONLY ONE NOTE IN THE MEASURE, I.E. PICK UP BAR
      //print('one note',scorePart[a].note)
      items.push(scorePart[a].note);
    } else {

      for (let i = 0; i < scorePart[a].note.length; i++) {
        //print(scorePart[a].note[i])
        items.push(scorePart[a].note[i]);
      }
    }
    //print(a,items);
    noteMeas.push([a,items.length]);  //MEASURE + AMOUNT OF NOTES
    note.push(items);

    //GATHER ALL DIRECTIONS-------------------<<<
    //print(staffNum)
    items = [];
    let staffNum = 0;

    if (scorePart[a].direction !== undefined) { //IF THERE ARE DIRECTION ELEMENTS
      //print(a,scorePart[a].direction)

      if(scorePart[a].direction.staff !== undefined){
        //print(scorePart[a].direction.staff)
        staffNum = int(scorePart[a].direction.staff);
      } else {
        staffNum = 1;
      }

      if (scorePart[a].direction.length !== undefined) {  //IF THERE ARE MORE THAN ONE DIRECTION ELEMENTS
        //print(scorePart[a].direction);
        for (let i = 0; i < scorePart[a].direction.length; i++) {
          //print(scorePart[a].direction[i]);

          //GATHER TEMPO
          if(scorePart[a].direction[i].sound !== undefined && scorePart[a].direction[i].sound["@tempo"] !== undefined){
            //print(a,scorePart[a].direction[i])
            if(scorePart[a].direction[i]["direction-type"].words !== undefined && scorePart[a].direction[i]["direction-type"].words.__text !== undefined && tempo.hasOwnProperty( scorePart[a].direction[i]["direction-type"].words.__text.toLowerCase() )){
              //print(a,scorePart[a].direction[i]["direction-type"].words)
              soundTempo = float(scorePart[a].direction[i].sound["@tempo"]);
            }
            if(scorePart[a].direction[i]["direction-type"].metronome !== undefined){
              //print(scorePart[a].direction[i]["direction-type"].metronome)

              if(scorePart[a].direction[i]["direction-type"].metronome["beat-unit-dot"] !== undefined){
                tempoDot = 1;
              } else {
                tempoDot = 0;
              }
              //print(tempoDot)

              metronome = [ scorePart[a].direction[i]["direction-type"].metronome["beat-unit"] , float(scorePart[a].direction[i]["direction-type"].metronome["per-minute"]), tempoDot];
              soundTempo = float(scorePart[a].direction[i].sound["@tempo"]);
              //print(fig[metronome[0]])
            }
          } else if(scorePart[a].direction[i]["direction-type"].words !== undefined && scorePart[a].direction[i]["direction-type"].words.__text !== undefined && tempo.hasOwnProperty( scorePart[a].direction[i]["direction-type"].words.__text.toLowerCase() )){
            //print(a,scorePart[a].direction[i]["direction-type"].words)
            soundTempo = float(tempo[scorePart[a].direction[i]["direction-type"].words.__text.toLowerCase()])
          }

          if (scorePart[a].direction[i]["direction-type"].length !== undefined) { //IF THERE ARE MORE THAN ONE DIRECTION-TYPE
            //print(scorePart[a].direction[i]);
            for (let j = 0; j < scorePart[a].direction[i]["direction-type"].length; j++) {
              //print(scorePart[a].direction[i]["direction-type"][j]);

              if (scorePart[a].direction[i]["direction-type"][j].words !== undefined && scorePart[a].direction[i]["direction-type"][j].words.__text !== undefined && tempo.hasOwnProperty( scorePart[a].direction[i]["direction-type"][j].words.__text.toLowerCase() )){
                //print(scorePart[a].direction[i]["direction-type"][j].words)
                soundTempo = float(tempo[scorePart[a].direction[i]["direction-type"][j].words.__text.toLowerCase()])
              }
              if (scorePart[a].direction[i]["direction-type"][j].metronome !== undefined){
                //print(scorePart[a].direction[i]["direction-type"][j].metronome)
                if(scorePart[a].direction[i]["direction-type"][j].metronome["beat-unit-dot"] !== undefined){
                  tempoDot = 1;
                } else {
                  tempoDot = 0;
                }
                //print(scorePart[a].direction[i].sound["@tempo"])

                metronome = [ scorePart[a].direction[i]["direction-type"][j].metronome["beat-unit"] , float(scorePart[a].direction[i]["direction-type"][j].metronome["per-minute"]), tempoDot];
                soundTempo = float(scorePart[a].direction[i].sound["@tempo"]);
                //print(fig[metronome[0]])
              }

              scorePart[a].direction[i]["direction-type"][j].staff = staffNum;
              items.push(scorePart[a].direction[i]["direction-type"][j]);
            } //EOf FOR LOOP FOR SEVERAL "direction type" ELTS

          } else {  //IF THERE'S ONLY ONE DIRECTION-TYPE IN THOSE DIRECTIONS
            //print(scorePart[a].direction[i]["direction-type"])
            scorePart[a].direction[i]["direction-type"].staff = staffNum;
            items.push(scorePart[a].direction[i]["direction-type"]);

          } //EOf ELSE IF THERE'S NOT MULTIPLE "direction-type" ELTS
        } //EOf FOR LOOP FOR DIRECTION ELTS
      } else {  //IF THERE'S ONLY ONE DIRECTION ELEMENT
        //print(scorePart[a].direction);
        if(scorePart[a].direction.sound !== undefined && scorePart[a].direction.sound["@tempo"] !== undefined){
          //print(a,scorePart[a].direction[i])
          if(scorePart[a].direction["direction-type"].words !== undefined && scorePart[a].direction["direction-type"].words.__text !== undefined && tempo.hasOwnProperty( scorePart[a].direction["direction-type"].words.__text.toLowerCase() )){
            //print(a,scorePart[a].direction[i]["direction-type"].words)
            soundTempo = float(scorePart[a].direction.sound["@tempo"]);
          }
          if(scorePart[a].direction["direction-type"].metronome !== undefined){

            if(scorePart[a].direction["direction-type"].metronome["beat-unit-dot"] !== undefined){
              tempoDot = 1;
            } else {
              tempoDot = 0;
            }

            metronome = [ scorePart[a].direction["direction-type"].metronome["beat-unit"] , float(scorePart[a].direction["direction-type"].metronome["per-minute"]), tempoDot ];
            soundTempo = float(scorePart[a].direction.sound["@tempo"]); //CAMBIE ESTA 2022-13
          }
        } else if(scorePart[a].direction["direction-type"].words !== undefined && scorePart[a].direction["direction-type"].words.__text !== undefined && tempo.hasOwnProperty( scorePart[a].direction["direction-type"].words.__text.toLowerCase() )){
          //print(a,scorePart[a].direction[i]["direction-type"].words)
          soundTempo = float(tempo[scorePart[a].direction["direction-type"].words.__text.toLowerCase()])
        }

        if (scorePart[a].direction["direction-type"].length !== undefined) {  //IF THERE ARE MORE THAN ONE DIRECTION-TYPE ELTS
          //print(scorePart[a].direction["direction-type"]);
          for (let i = 0; i < scorePart[a].direction["direction-type"].length; i++) {
            //print(scorePart[a].direction["direction-type"][i]);

            scorePart[a].direction["direction-type"][i].staff = staffNum;
            items.push(scorePart[a].direction["direction-type"][i]);

          } //EOf FOR LOOP FOR SEVERAL "direction-type" ELTS

        } else {  //IF THERE IS ONLY ONE DIRECTION-TYPE IN DIRECTION ELT
          //print(a,scorePart[a].direction["direction-type"]);

          scorePart[a].direction["direction-type"].staff = staffNum;
          items.push(scorePart[a].direction["direction-type"]);

        }
      }
    }
    tempoList.push(soundTempo);
    metroList.push(metronome);
    //print(a,items);
    //print(soundTempo)
    direction.push(items);  //EACH items HAS ITS MEASURE IN INDEX (ALSO IF IT IS EMPTY)

    //GATHER ALL ATTRIBUTES-------------------<<<
    items = [];

    if (scorePart[a].attributes !== undefined) {  //IF THERE ARE ATTRIBUTES IN MEASURE
      //print(scorePart[a].attributes)

      if (scorePart[a].attributes.length !== undefined) { //IF THERE'S MORE THAN ONE ATTRIBUTE
        //print(scorePart[a].attributes)

        for (let i = 0; i < scorePart[a].attributes.length; i++) {

          //FIRST ADD MEASURE KEY FOR xPos
          scorePart[a].attributes[i].measure = a;
          //print(scorePart[a].attributes)

          //GET QUANTIZATION UNIT WITH RESPECT TO A QUARTER (IN SPECIFIC PART, IN MULTIPART THIS SHOULD BE AN ARRAY)
          if(scorePart[a].attributes[i].divisions !== undefined){  //IF THERE ISN'T A DIVISION ELEMENT
            divisions = fig[metronome[0]] / scorePart[a].attributes[i].divisions;
          }

          items.push(scorePart[a].attributes[i]);
          //print(scorePart[a].attributes[i])
        }
      } else {   //IF THERE'S ONLY ONE ATTRIBUTE ELT
        //print(scorePart[a].attributes)

        //GET QUANTIZATION UNIT WITH RESPECT TO A QUARTER (IN SPECIFIC PART, IN MULTIPART THIS SHOULD BE AN ARRAY)
        if(scorePart[a].attributes.divisions !== undefined){  //IF THERE ISN'T A DIVISION ELEMENT
          divisions = fig[metronome[0]] / scorePart[a].attributes.divisions;
        }

        //FIRST ADD MEASURE KEY FOR xPos
        scorePart[a].attributes.measure = a;
        //print(scorePart[a].attributes)

        items.push(scorePart[a].attributes);
        //print(scorePart[a].attributes)
      }
    }
    attribute.push(items);  //EACH items HAS ITS MEASURE IN INDEX (ALSO IF IT IS EMPTY)

  }
  //print(fig[metronome[0]]);
  //print(note);
  //print(direction);
  //print(attribute);
  //print(noteMeas);
  //print(divisions);
  //print(metroList)

  return [scorePart, noteMeas];
}
