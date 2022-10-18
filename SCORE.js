//GLOBAL VARIABLES
let partName, scoreName, nStaves = [], partId, id, scorePart, timeSig = [], divisions, rhythmMeasAcc = [], rhythmMeas = [],
all, accumX, under,
accents, accentsDur, tempoDefault, tactus, tempoList = [], metroList = [],
dynWords, exprWords, repWords, defaultDyn,
note = [], direction = [], attribute = [],
scare, scareXML, measNum,
osmd, ith = 1, blacks = 0, pixelsPerMeasure = [],
g, ctx, x, y,
generalEntropy = 0, entropyMax = [],
results = [], idx = 0, fileList = [],
directory = './beeth', str = ".xml", //TEXT WITH WHICH APPEARS THE NAME OF THE FILE IN DIRECTORY;
barBool = false,
fig = {whole: 1, half: 1 / 2, quarter: 1 / 4, eighth: 1 / 8, "16th": 1 / 16, "32nd": 1 / 32, "64th": 1 / 64, "128th": 1 / 128};

//ELEMENTS
let jsonObj, measures, rhythmedHisto, pitchedHisto, mruData, ulmIndex, keyHisto, restHisto, dotHisto, tiedHisto, rhythmIntHisto, alterHisto, pitchIntHisto, fermataHisto, ornamentsHisto, articulationsHisto, trillHisto, sluredHisto, dynamicsHisto, wedgedHisto, agogExprHisto, octaveHisto, repeatSignsHisto, barsHisto, clefHisto, pitchProbs, rhytmhProbs, dynamicsProbs, wedgeProbs, slurProbs, barsProbs, clefProbs, restProbs, dotProbs, tiedProbs, rhythmIntProbs, alterProbs, pitchIntProbs, fermataProbs, ornamentsProbs, articulationsProbs, trillProbs, agogExprProbs, octaveProbs, repeatSignsProbs;

//WEIGHTS
let weights = {
  Expression: 0.934,
  Accidental: 0.978,
  Articulation: 0.994,
  Barline: 0.953,
  Clef: 0.933,
  Dot: 0.968,
  Dynamic: 1,
  Fermata: 0.979,
  PitchInterval: 0.979,
  RhythmInterval: 0.979,
  OctaveSigns: 0.949,
  Ornament: 0.987,
  Pitch: 0.924,
  RepetitionSign: 0.993,
  Rest: 0.951,
  RhythmFigure: 0.937,
  Slur: 0.99,
  Tie: 0.972,
  Wedge: 0.958
};

function preload() {

  let xmlHttp = new XMLHttpRequest();

  xmlHttp.open('GET', directory, false); // false for synchronous request
  xmlHttp.send(null);

  let ret = xmlHttp.responseText,
  fileLines = ret.split('\n');

  for (let i = 0; i < fileLines.length; i++) {
    //print(fileLines[i])

    if(fileLines[i].includes(str)){  //IF STRING HAS THE STR STRING ANYWHERE
      //print(fileLines[i])
      let fileName = fileLines[i].split('<a href="').pop().split('"')[0];
      fileList.push(fileName);
    }
  }
  //print(fileList.length)

  dynWords = loadStrings("modules/textDefinitions/thesaurusDynamics.txt");
  exprWords = loadStrings("modules/textDefinitions/thesaurusExpression.txt");
  repWords = loadStrings("modules/textDefinitions/thesaurusRepetition.txt");

  osmd = new opensheetmusicdisplay.OpenSheetMusicDisplay("osmdCanvas"); //GENERATE A OPEN SHEET MUSIC DISPLAY CANVAS

  //DEFAULTS
  partName = "Piano";
  accents = 2;
  accentsDur = 0.125;
  tactus = 2;
  tempoDefault = 60; //IF THERE AREN'T @TEMPO INDICATIONS
  defaultDyn = "p";
}

function setup() {
  //createCanvas(10, 10);
  g = createCanvas(200, 200);
  pixelDensity(1);
}

function draw(){
  //RESET SOME VARIABLES
  nStaves = [];
  divisions = 0;
  all = [];
  accumX = [];
  under = [];
  generalEntropy = 0;

  noLoop(); //ONLY ONCE

  document.getElementById("osmdCanvas").hidden = false; //SHOW CANVAS

  //FOR LISTING FILES USING <input> ELEMENT IN index.html
  // let i = document.querySelector('input').addEventListener('change', (e)=>{
  //   for(let i = 0; i < e.target.files.length; i++)
  //   {
  //     console.log(e.target.files[i].name);
  //   }
  // });

  scare = fileList[idx];
  //scare = '/samplesTh/L11.xml'
  print(`//============> Working on the file ${scare}`);

  scareXML = loadXML(scare, () => { //CALLBACK THAT INITIATES THE SEQUENCE
    measNum = scareXML.getChildren("measure").length / scareXML.getChildren("score-part").length;
    sequencer() //THIS ONLY WORKS AS AN ENDLESS PROMISE FOR SEVERAL .THEN ==> SURE THERE'S A BETTER WAY TO SEQUENCE PROCESSES

    .then( () => {
      console.log('0. BUILD JSON FROM XML');
      //print(scareXML)
      xmlCorrected = xmlDefaultX(scareXML);
      let x2js = new X2JS({
        attributePrefix: "@",
      });
      jsonObj = x2js.xml_str2json(xmlCorrected.serialize());
      //print(jsonObj)
    })

    .then( () => {
      console.log('1. GATHER ALL NOTE, DIRECTION, AND ATTRIBUTE INFORMATION FOR THE PART');
      measures = gatherNotesAccum(jsonObj);
    })

    .then( () => {
      console.log('2. BUILD ARRAYS FOR RHYTHM AND PITCH');
      rhythmedHisto = rhythmedNotes(nStaves);
      //print(rhythmedHisto)
    })
    .then( () => {
      pitchedHisto = pitchedNotes(nStaves);
      //print(pitchedHisto)
    })

    .then( () => {
      console.log('3. BUILD THE MRU INFORMATION AND INDEX FOR EACH EVENT OF THE PART');
      mruData = mru(nStaves);
      //print(mruData)

    })

    .then( () => {
      console.log('4. BUILD HISTOGRAMS FOR THE HEADER INFORMATION');
      keyHisto = keyedNotes();
      //print(keyHisto)
    })
    .then( () => {
      //ADDING PROBABILITY TABLES FOR RHYTHM AND PITCH
      //print(mruData[4], rhythmedHisto[0], mruData[1])
      rhytmhProbs = htp(mruData[4], rhythmedHisto[0], mruData[1]);
      pitchProbs = htp(mruData[4], pitchedHisto[0], mruData[1]);
      //print(rhytmhProbs)
    })

    .then( () => {
      console.log('5. BUILD HISTOGRAMS AND PROBABILITY TABLES FOR <note> ELEMENTS');
      restHisto = restedNotes(nStaves);
      restProbs = htp(mruData[4], restHisto, mruData[1]);
      //print(restProbs)
    })
    .then( () => {
      dotHisto = dottedNotes(nStaves);
      dotProbs = htp(mruData[4], dotHisto, mruData[1]);
      //print(dotProbs)
    })
    .then( () => {
      tiedHisto = tiedNotes(nStaves);
      tiedProbs = htp(mruData[4], tiedHisto, mruData[1]);
    })
    .then( () => {
      rhythmIntHisto = intervalR(rhythmedHisto[0], nStaves);
      rhythmIntProbs = htp(mruData[4], rhythmIntHisto, mruData[1]);
    })
    .then( () => {
      alterHisto = alteredNotes(nStaves);
      alterProbs = htp(mruData[4], alterHisto, mruData[1]);
      //print(alterProbs)
    })
    .then( () => {
      pitchIntHisto = intervalP(pitchedHisto[0], nStaves, mruData[1]);
      //print(pitchIntHisto)
      pitchIntProbs = htp(mruData[4], pitchIntHisto, mruData[1]);
      //print(pitchIntProbs)
    })
    .then( () => {
      fermataHisto = fermattedNotes(nStaves);
      fermataProbs = htp(mruData[4], fermataHisto, mruData[1]);
      //print(fermataProbs)
    })
    .then( () => {  //JOIN ORNAMENTS AND TRILL WITH TREMOLO
      ornamentsHisto = ornamTrill(nStaves);
      ornamentsProbs = htp(mruData[4], ornamentsHisto, mruData[1]);
    })
    .then( () => {
      articulationsHisto = articulatedNotes(nStaves);
      articulationsProbs = htp(mruData[4], articulationsHisto, mruData[1]);
    })
    .then( () => {
      sluredHisto = sluredNotes(nStaves);
      //print(sluredHisto);
      slurProbs = htp(mruData[4], sluredHisto, mruData[1]);
      //print(slurProbs)
    })

    .then( () => {
      console.log('6. BUILD HISTOGRAMS AND PROBABILITY TABLES FOR <direction> ELEMENTS');
      dynamicsHisto = dynamics(nStaves, pitchedHisto[1]);
      //print(dynamicsHisto);
      dynamicsProbs = htp(mruData[4], dynamicsHisto, mruData[1]);
      //print(dynamicsProbs);
    })
    .then( () => {
      wedgedHisto = wedgedNotes(nStaves, pitchedHisto[1], rhythmedHisto[1]);
      //print(wedgedHisto);
      wedgeProbs = htp(mruData[4], wedgedHisto, mruData[1]);
    })
    .then( () => {
      agogExprHisto = expressedNotes(nStaves, pitchedHisto[1], rhythmedHisto[1]);
      //print(agogExprHisto)
      agogExprProbs = htp(mruData[4], agogExprHisto, mruData[1]);
    })
    .then( () => {
      octaveHisto = octavedNotes(nStaves, pitchedHisto[1], rhythmedHisto[1]);
      octaveProbs = htp(mruData[4], octaveHisto, mruData[1]);
    })

    .then( () => {
      console.log('7. BUILD HISTOGRAMS AND PROBABILITY TABLES FOR <attribute> ELEMENTS');
      barsHisto = barlines(rhythmedHisto[1], mruData[1]);
      //print(barsHisto)
      barsProbs = htp(mruData[4], barsHisto, mruData[1]);
      //print(barsProbs)
    })
    .then( () => {
      repeatSignsHisto = repeatedNotes(nStaves, rhythmedHisto[1]);
      //print(repeatSignsHisto)
      repeatSignsProbs = htp(mruData[4], repeatSignsHisto, mruData[1]);
      //print(repeatSignsProbs)
    })
    .then( () => {
      clefHisto = clefs(nStaves, pitchedHisto[1]);
      //print(clefHisto)
      clefProbs = htp(mruData[4], clefHisto, mruData[1]);
    })

    .then( () => {
      console.log('8. SUM ALL TOGHETHER WITH PONDERATION');
      entropyMax = [];
      entropyMax.push(ent(agogExprProbs, mruData[1]));
      entropyMax.push(ent(alterProbs, mruData[1]));
      entropyMax.push(ent(articulationsProbs, mruData[1]));
      entropyMax.push(ent(barsProbs, mruData[1]));
      entropyMax.push(ent(clefProbs, mruData[1]));
      entropyMax.push(ent(dotProbs, mruData[1]));
      entropyMax.push(ent(dynamicsProbs, mruData[1]));
      entropyMax.push(ent(fermataProbs, mruData[1]));
      entropyMax.push(ent(pitchIntProbs, mruData[1]));
      entropyMax.push(ent(rhythmIntProbs, mruData[1]));
      entropyMax.push(ent(octaveProbs, mruData[1]));
      entropyMax.push(ent(ornamentsProbs, mruData[1]));
      entropyMax.push(ent(pitchProbs, mruData[1]));
      entropyMax.push(ent(repeatSignsProbs, mruData[1]));
      entropyMax.push(ent(restProbs, mruData[1]));
      entropyMax.push(ent(rhytmhProbs, mruData[1]));
      entropyMax.push(ent(slurProbs, mruData[1]));
      entropyMax.push(ent(tiedProbs, mruData[1]));
      entropyMax.push(ent(wedgeProbs, mruData[1]));
      //print(entropyMax)

      //WITH PONDERATION
      for (let i = 0; i < entropyMax.length; i++){
        let ponds = entropyMax[i] * Object.values(weights)[i];
        generalEntropy += ponds;
      }

      // //WITHOUT PONDERATION
      // for (var x = 0; x < entropyMax.length; x++){
      //   generalEntropy += entropyMax[x];
      // }

      // //  ONLY PITCH AND RHYTHM, WITHOUT PONDERATION
      // generalEntropyPitchRhythm =
      // ent(pitchProbs, nStaves) + ent(rhytmhProbs, nStaves);
    })

    .then( () => {
      let velocity = mruData[2]/1000;
      //print(entropyMax)
      print(`Index information for the ${partName} part of the score "${scoreName}", with tactus level ${tactus+1}:
      * MRUs: ${mruData[1]}
      * Free Energy: ${ raund( generalEntropy * velocity) } bits per second
      * Bits per MRU: ${ raund( generalEntropy ) }
      * Fifths: ${raund(keyHisto)}
      * Ink amount: ${ (blacks / measNum).toFixed(3) }`);

      results.push([ scare, raund( generalEntropy * velocity), mruData[1], raund( generalEntropy ), raund(keyHisto), raund(blacks / measNum) ]);

      if(idx < fileList.length-1){
        idx++;
        redraw();
      } else {
        print('Process finished <============//\n',results);
      }
    })

    // .then( () => {
    //   console.log('9. BUILD PIXEL PARSING AND EMIT THE REPORT');
    //   openSheet();
    // })

    .catch((err) => {
      console.log(err);
    }); //END OF SEQUENCE
  }); //END OF LOADXML'S CALLBACK
} //EOF

function raund(value){
  return (Math.round(( value  + Number.EPSILON) * 1000) / 1000);
}
