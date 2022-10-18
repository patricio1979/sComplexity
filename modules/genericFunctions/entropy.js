function ent(total, mruNum) {
  //print(Object.keys(total[0]).length)
  //print(total)

  let entropyMru = new Array(mruNum).fill(0), kldMru = [];

  //total[0] ARE THE PROBABILITIES FOR EACH ELEMENT total[1] IS THE OCURRENCE OF THE ELEMENTS IN EACH mru
  if(Object.keys(total[0]).length > 0 ){

    //GO THRU EACH STAFF OF mru OCURRENCES
    for (let a = 0; a < total[1].length; a++) {
      //print(Object.keys(total[1][a]).length);
      //print(a)

      if(Object.keys(total[1][a]).length > 0) {

        //GO THRU EACH OCURRENCE IN EACH mru AND FIND THE PROBABLITY FOR THAT ELEMENT
        for (let d = 0; d < Object.keys(total[1][a]).length; d++) {
          //print(Object.keys(total[1][a]).length)
          let current = Object.keys(total[1][a])[d],  //elt
          serrent = Object.values(total[1][a])[d],  //amount of current elts in MRU
          parrent = total[0][current];  //probability of current
          //print(current, serrent, parrent)

          //CALC EACH ENTROPY
          for (let e = 0; e < serrent; e++) {
            entropyMru[a] += (-1 * (parrent * Math.log2(parrent)));
          }
        }
      }
    }
    //print(entropyMru);

    //KULLBACK dvg
    //FILL EACH TOTAL[0]
    //print(total,mruNum)
    let temp = Array(Object.keys(total[0]).length).fill(1);
    let tempQ = [...temp];
    let histo = Object.keys(total[0]);
    let klD = [], add = 0;

    if (Object.keys(total[0]).length > 1){  //build histogram tables
      //print(Object.keys(total[0]))
      //print(temp)
      let p,q,pSize,qSize;

      for (let i = 0; i < Object.keys(total[1]).length; i++){ //go through each MRU
        //print(Object.keys(total[1])[i], Object.values(total[1])[i])
        temp = Array(Object.keys(total[0]).length).fill(1);
        klD.length = 0;

        for (let j = 0; j < Object.keys(total[1])[i].length; j++){

          if(Object.keys(total[1][i])[j] !== undefined){
            //print(Object.keys(total[1][i])[j], Object.values(total[1][i])[j])
            temp[ histo.indexOf( Object.keys(total[1][i])[j] ) ] += float(Object.values(total[1][i])[j]);
          }
        }

        pSize = temp.reduce((a, b) => a + b, 0);
        qSize = tempQ.reduce((c, d) => c + d, 0);

        //print(temp);

        for (let k = 0; k < temp.length; k++){
          //print(temp[k] / pSize)
          klD.push( (temp[k] / pSize) * Math.log2((temp[k] / pSize) / (tempQ[k] / qSize)) )
        }
        //print(klD)
        tempQ = temp;
      }
    }
    add = (klD.reduce((a, b) => a + b, 0)) + (entropyMru.reduce((c, d) => c + d, 0));
    //print("distinto",klD,entropyMru)

    totalEntropy = add / mruNum;
    return totalEntropy
  } else {

    return 0
  }
}
