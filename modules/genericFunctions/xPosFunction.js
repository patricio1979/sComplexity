function xPosFunc(element, xPos, measure) { //GETTING THE ELEMENT IN HTML, THE XPOS OF THE SCORE, AND THE MEASURE IN WHICH THIS ELEMENT IS IN
  let it = [];
  //print(element['@default-x'])
  //print(element)
  //print(xPos)
  //print(measure)

  //STAVES
  for (var xa = 0; xa < xPos.length; xa++) {
    //print(xPos[xa])

    //VOICES
    for (var xb = 0; xb < xPos[xa].length; xb++) {
      //print(xPos[xa][xb]);

      //ELTS
      for (var xc = 0; xc < xPos[xa][xb].length; xc++) {
        //GO THROUGH XPOS TO LOCATE ATTxcHMENT
        //print(xa,xb,xc,xPos[xa][xb][xc]);

        //JUST CHECK IN THE CURRENT MEASURE
        if (xPos[xa][xb][xc][0] == measure) {
          //print(xPos[xa][xb][xc])
          //print(xPos[xa][xb][xc][2]);
          //print(xa,xb,xc,element["@default-x"])
          if (xPos[xa][xb][xc][2] == float(element["@default-x"])) {
            //print(element["@number"])
            //IF THE @number ATTRIBUTE EXISTS APPENDS TO 'IT'

            if (element["@number"] !== undefined) {
              //print(xa+1,int(element["@number"]))
              it.push( xa, xb, xPos[xa][xb][xc][1], int(element["@number"]))
            } else if (element["@number"] == undefined) {
              it.push( xa, xb, xPos[xa][xb][xc][1], 0);
            }
          }
        }
      }
    }
  }
  return it //RETURN xa STAVE or ELT NUMBER / xb VOICE / xc INDEX OF NOTE EQUAL TO DEFAULT-X / ELT NUMBER
}
