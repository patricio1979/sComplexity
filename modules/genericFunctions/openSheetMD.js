function openSheet() {

  osmd
  .load(scare)
  //First
  .then((value) => {
    //print('1 osmd');
    osmd.EngravingRules.RenderKeySignatures = false;
    osmd.EngravingRules.RenderClefsAtBeginningOfStaffline = false;
    osmd.EngravingRules.RenderTimeSignatures = false;
    //print(osmd.sheet.instruments);
    //print(osmd.sheet.lastMeasureNumber);
    osmd.setOptions({
      drawTitle: false,
      drawSubtitle: false,
      drawCredits: false,
      drawComposer: false,
      drawLyricist: false,
      drawFingering: false,
      drawMeasureNumbers: false,
      drawMetronomeMarks: false,
      autoBeam: false,
      autoResize: false,
      autoGenerateMutipleRestMeasuresFromRestMeasures: false,
      drawHiddenNotes: false,
      drawFromMeasureNumber: ith,
      drawUpToMeasureNumber: ith,
      drawPartNames: false,
      backend: "canvas",
    });
    //osmd.zoom = 0.75;
    osmd.updateGraphic();
    osmd.render();
  })
  //Second
  .then(() => {//print('2 convert');
    convert();
  })
  //Third
  .then(() => {//print('3 raster');
    raster();
  })
  //Fourth
  .then(() => {//print('4 check');
    check();
  })
  //Error
  .catch((err) => {
    console.error(err);
  });
}

function convert() {

  let cnv = document.getElementById("osmdCanvasVexFlowBackendCanvas1");
  ctx = cnv.getContext("2d");

  x = cnv.width;
  y = cnv.height;
  // g.drawingContext = ctx;
}

function raster() {
  let count = 0,
  blackPixels = 0;

  let imgd = ctx.getImageData(0, 0, x, y);
  let pix = imgd.data;

  for (var i = 0, n = pix.length; i < n; i += 4) {
    if (pix[i+3] != 0) {
      blackPixels++;
    }
  }

  blacks += blackPixels;
  pixelsPerMeasure.push(blackPixels);
}

function check(){
  //print(ith,blacks);
  if (ith < measNum) {
    ith++; //MEASURE NUMBER
    setTimeout(() => {openSheet();
    },100); //draw next measure;
  } else {
    document.getElementById("osmdCanvas").hidden = true;

    print(`Index information for the ${partName} part of the score "${scoreName}", with tactus level ${tactus+1}:
    * The average complexity is ${ raund(generalEntropy / (mruData[1] * velocity)*1000 ) } bits per second.
    * There are ${mruData[1]} MRUs, and each has an average of ${ raund((generalEntropy / mruData[1])*1000) } of information, and ${mruData[2].toFixed(3)} of duration.
    * Changes in fifths (average of key signature changes) are ${raund(keyHisto)} in average.
    * There is an average of ${ (blacks / measNum).toFixed(3) } black pixels per measure in the score.`);

    results.push([ scare, raund( (generalEntropy / (mruData[1] * velocity))*1000), mruData[1], raund((generalEntropy / mruData[1])*1000), raund(keyHisto), raund(blacks / measNum) ]);

    //print(idx)
    if(idx < fileList.length-1){
      idx++;
      //print(idx);
      redraw();
    } else {
      print('finished',results);
    }
  }
}
