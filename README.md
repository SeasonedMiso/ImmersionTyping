```CONCEPT~~~~~~~~~~~~~~~~~~~~~~~~~~~
//japanese typing gaming

//aesthetic minimalist design
//different color schemes

//features
//wpm per paragraph then set to account
//option to practice without affecting account
//no time limit
//paragraphs of japanese from ebook or plain text, or from webpage (extension?)

//past text (done) will have furigana
//input is pure romaji
//accepts all possible ways to input char, ちょう could be chou, cyou
//if you give up on that word, press enter to skip the word

//records which buttons you are most likely to misinput
//which words you don't know
//which readings of which kanji you struggle with
//which kanji in generel you fail a lot
//list of successfully inputted words with frequency
//stats of which words come up etc

//user accounts with user save data

//database of saved and failed words in context
//hover over word with mouse to save
//export to anki
//import from anki and rep sentences (able to sort by maturity, fails, due date etc)

//optional rain sounds, white noise, keyboard sounds

^^^^^code format^^^^^
change variable names to be readable, check for null vals and jsons etc
switch statement key inputs
neaten code
break stuff into more functions
more components
get rid of nested if statements
get rid of else statements
break vars that change into as many const variables as posisble

---

-implement last sentence blurred above current sentence
accuracy calculation

------------------------english support----------------------
MAJOR BUGS~~~~~~
-handle symbols like , and . (comma returns ¼)

~~~~~~MINOR BUGS~~~~~~
-make map between keycode and ascii codes
-switch statement inputs
-test more browser hotkeys
-change wpm algorithm
[gross wpm = ((alltypedchars)/5)/timeinmin]
[grosswpm - uncorrectederrors/time]
only errors left uncorrected are penalized

~~~~~~PLANNED FEATURES~~~~~~
--volume up down and mute
-reset sentence if alt-tab out
-record incorrect keystrokes
-allow hotkeys before game has started, esc to exit game and enable hotkeys

------------------------japanese support----------------------
~~~~~~~MAJOR BUGS~~~~~~
--right now, inputOtherChar(), takes verbs, compund nouns with mixed kana and kanji, symbols like commas, mixes of special and kana. This means that its broken and doesn't really know how to deal with n, and that it floats ruby on top even for kana in
--make it so if kana word has n like ランキング that when you press g of gu, keeps g in remainingRomajiInput
--for kana word fix nya, nyo, nyu
--add space back in just for words to end in n
-- fix romaji + nnno
-- add word type to json

~~~~~~MINOR BUGS~~~~~~
--refactor inputKanjiNotN()
--divide punctionation into its own index in json
--gen json from migacc, remove \;(.*?)\]
--generate readings for kanji with no ruby provided, but keep provided ruby

~~~~~~PLANNED FEATURES~~~~~~
-overhall mistype functionallity to color chars that have been mistyped
--furigana over old words]
--save preppedJson into src without prompt
--make sure that can take ruby from normal ebook formating
--switch to english mode for romaji
reggie advice:
if "if statement" spans whole function then reverse logic to eliminate indent
english: change sentence etc to be arrays, not strings
```
