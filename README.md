# sComplexity
 Provisional implementation of the RIM (Readability Index for Music)

"READABILITY INDEX for scores written with Common Western Music Notation (CWMN)"
Calatayud, P. F.;
Padilla Longoria, P.;
Galera-Núñez, M. del M.;
Pérez-Acosta, G.

Implemented by Patricio F. Calatayud in a Opera Browser with the libraries
p5.js
openSheetMusicDisplay
xml2json.js

License...

REQs
*   Scores must be in musicXML format, and off course, well written, otherwise will be errors. Well written means no hidden text,
    nor notes, not anything that we will be measuring.
*   The score must contain a Time Signature, and tempo information at the start, otherwise it will be a default of 4/4
    at 60 BPMs.
*   We need always notes (even silences) on voice 1.
*   All anacruxis (pickup bar) and methacruxis (pickup bar complemente) need to have rest values for that measure,
    and not measure rests.
*   All words (expression, instrument change, agogic, system text, part text, etc.) should be added BEFOREhand to the
    thesaurus files if we want to identify it as information. The file is in the textDefinitions folder.
    As lyrics are idiomatic writing, there are not included in the measure --perhaps a normal readability index is an option.

ISSUES
*   JSON organices the information differently from XML.
    In the later information can be sequential, but in the first are organized as a group.
    The order of <direction> elements, possible in XML, is lost in JSON.
*   At the moment we cannot measure x dimension distance of some elements (eg. dynamics) from measure bars,
    so they need to be attached to <note> elements.
*   If there are metronome equivalences, MuseScore and Sibelius don't add the <metronome-relation> element,
    making the relation unmeasurable.
    See https://musescore.org/en/node/270643. This is important when changin Time Measure from binary to ternary, and inversely.
*   The <measure-repeat> element is not present in the MuseScore exported file.
*   Pickup bars are not defined. The actual implementation seems to work this out, but there could be problems.
*   For grace notes and accacciaturas we decided to clear its duration, as we aren't completely sure about its exact value
    when reading.
*   At the moment, multimeasure rest is not implemented. MuseScore exports each measure whole silence sepparatedly.
*   Wedges are measured for all voices togheter in each staff.

TODO
*   Make accents, and sub-beat tactus available.
*   Attach <direction> elements to each staff and each voice. This will wait until a new musicXML definition is ready.
*   Implement other music file formats like GUIDO (https://guidodoc.grame.fr/),
    MXN (https://w3c.github.io/mnx/docs/), ABC (https://abcnotation.com/), HUMDRUM (https://www.humdrum.org/),
    or even MIDI format.
    You can convert formats to musicXML (ABC: https://abc2xml.appspot.com/, GUIDO: http://debussy.music.ubc.ca/NoteAbility/,
    HUMDRUM http://www.music-notation.info/en/software/hum2xml.html,
    MIDI: https://www.w3.org/2021/06/musicxml40/tutorial/midi-compatible-part/)

V. 0.1
--->W.N.
--->B.F.
KLdivergence improved
Ternary measures fixed
Entropy report was divided twice by MRUs: Fixed.

V. 0.09
--->W.N.
--->B.F.
KLdivergence repaired
Reports include channel capacity with correct numbers
MRU combination repaired
Time Signatures with number one as denominator, included.
--->TODO tempo in Beethoven's study case

V.0.06 to 0.08 are not documented.

V. 0.05
--->W.N.
No more GUI for the moment.
Folder processing for large corpora (will take time as pixel measuring is slow yet).
__tactus.js is out, were merged with __mruAvg.js
trill.js out too, merged with ornaments.js. Now it's called ornamTrill.js
There's a new thesaurus, in the form of an js file for tempo values and their pulse velocity. This is for scores that have
tempo text but no @tempo attribute.
--->B.F.

V.0.04 to 0.01 are not documented.
