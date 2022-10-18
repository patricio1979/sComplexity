function xmlDefaultX(xml) {
  let measures, elements,
  defaultX = 0, defXAll = 0,
  defPart, closest, notes;

  //print(xml);

  ids = xml.getChildren("score-part");
  //print(ids);
  parts = xml.getChildren("part");
  //print(parts);

  //GET ID OF PART
  //print(ids[0].getChild("part-name").getContent());
  for (let z = 0; z < ids.length; z++) {
    if (ids[z].getChild("part-name").getContent() == partName) {
      id = ids[z].getString("id");
    }
  }

  //PARSE SPECIFIC PART
  for (let a in parts) {
    //print(parts[a].getString("id"));
    if (parts[a].getString("id") == id) {
      //print(parts[a]);
      measures = parts[a].getChildren("measure");
      //print(measures)
      //print(measures[3].getChildren())
      for (let b = 0; b < measures.length; b++) {
        //print(measures[b])
        elements = measures[b].getChildren();
        //print(elements);
        //print(elements[5])

        //GET ALL X-POS
        for (let cPrev = 0; cPrev < elements.length; cPrev++) {

          if (elements[cPrev].getName() == "note") {

            if (elements[cPrev].hasAttribute("default-x")) {

              defXAll = elements[cPrev].getString("default-x");
              //print(defXAll);

            } else {
              elements[cPrev].setAttribute("default-x", defXAll);
            }
            //print(elements[cPrev].getString("default-x"))
          }
        }
        //print(elements)

        notes = [];

        //GO THRU ALL OTHER ELEMENTS
        for (let ca = 0; ca < elements.length; ca++) {
          //print(elements[ca])

          if (elements[ca].getName() == "note") {
            //print(elements[ca].getChild('rest'));

            //RESTS DOES NOT HAVE x-position SO WE GET RID OF THEM
            if (elements[ca].getChild("rest") === undefined) {
              //print(elements[ca].getChild('pitch').getContent());
              notes.push(ca);
            }
          }
          //print(notes)
        }
        //print(elements)

        //CLEF
        for (let c = 0; c < elements.length; c++) {

          if (elements[c].getName() == "attributes") {
            let attr = elements[c].getChildren();

            for (let att = 0; att < attr.length; att++) {
              //print(attr[att]);

              if (attr[att].getName() == "clef") {
                //print('clef')

                if (notes.length > 0) {
                  let defXA;

                  closest = notes.reduce((prev, curr) => {
                    return Math.abs(curr - (c+1)) < Math.abs(prev - (c+1)) ? curr : prev;
                  });

                  defXA = elements[closest].getString("default-x");
                  //print(defXA);

                  attr[att].setAttribute("default-x", defXA);
                } else {
                  attr[att].setAttribute("default-x", 0);
                }
              }
            }
          }

          //print(notes)
          //DIRECTION ELEMENTS
          if (elements[c].getName() == "direction") {
            //print(elements[c].getChild(0).getChild(0).getName());

            if (notes.length > 0) {
              let defXD;

              closest = notes.reduce((prev, curr) => {
                return Math.abs(curr - (c+1)) < Math.abs(prev - (c+1)) ? curr : prev;
              });

              defXD = elements[closest].getString("default-x");

              //print(notes,elements[c].getChild(0).getChild(0),c+1,closest, defXD);

              elements[c].getChild(0).getChild(0).setAttribute("default-x", defXD);
              //print(elements[c].getChild(0).getChild(0))
            } else {
              elements[c].getChild(0).getChild(0).setAttribute("default-x", 0);
            }
          }
        }
      }
    }
  }
  //print(xml)
  return xml;
}
