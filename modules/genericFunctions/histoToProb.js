function htp(index, histo, mruNum) {

  //print(index);
  //print(histo);
  //print(mruNum);
  //print(rhythmMeas);
  //print(barBool)

  let probabilities = [];
  let histogram = Array.from(Array(mruNum), () => new Array(0));  //HISTOGRAM PER MRU

  //STAVES
  for (let a = 0; a < histo.length; a++) {
    //print(histo[a])

    //VOICES
    for (let b = 0; b < histo[a].length; b++) {
      //print(histo[a][b])

      histo[a][b].sort(function(a,b) { return a[0]-b[0] })  //SORT ELEMENTS
      //print(histo[a][b].length,rhythmMeas[a][b].length);

      for (var c = 0; c < histo[a][b].length; c++) {
        //print(histo[a][b][c])

        probabilities.push(histo[a][b][c][1]);

        if(!barBool){
          histogram[ rhythmMeas[a][b][ histo[a][b][c][0] - 1 ][3] ].push(histo[a][b][c][1]);
        } else {
          histogram[histo[a][b][c][0]].push(histo[a][b][c][1])
        }
      }
    }
  }

  probabilities = probFromHist(probabilities);

  //print(probabilities)
  //print(histogram)

  for (let i = 0; i < histogram.length; i++) {
    histogram[i] = histomru(histogram[i]);
  }
  //print(probabilities,histogram);
  barBool = false;
  return [probabilities, histogram]; //RETURN PRBABILITY TABLES AND HISTO PER mru
}

function histomru(list) {
  let coso = list.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
  }, {});
  return coso;
}

function probFromHist(list) {
  let hist = list.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
  }, {}); // histogram
  let probMin = 1 / list.length;
  //print(hist);
  for (let i in hist) {
    hist[i] = hist[i] * probMin;
  }
  return hist;
}
