function sequencer(){
  return new Promise(function(resolve, reject) { //resolve = success; reject = failure
    //PRINT START
    var req = "success";
    if (req == "success") {
      //print(req)
      resolve(req);
    }
    else {
      //CONDITIONS FOR REJECTION...
      reject();
    }
  })
}
