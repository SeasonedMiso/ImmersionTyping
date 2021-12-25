CONCEPT~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
neaten code
break stuff into more functions
more components
get rid of nested if statements
get rid of else statements
break vars that change into as many const variables as posisble

------------------------english support----------------------

```MAJOR BUGS~~~~~~
-handle symbols like , and .
~~~~~~MINOR BUGS AND PLANNED FEATURES~~~~~~
-volume up down and mute
-reset sentence if alt-tab out
-record incorrect keystrokes
-test more browser hotkeys
-allow hotkeys before game has started, esc to exit game and enable hotkeys

------------------------japanese support----------------------

~~~~~~~MAJOR BUGS~~~~~~
--fix nyo, nyu, nya input
--handle ・  、and 。
-- fix okurigana handling in json
-- no input shown for また、
--fix honsaku => ほんあく where as honnsaku => ほんさく

~~~~~~MINOR BUGS AND PLANNED FEATURES~~~~~~
--divide punctionation into its own index in json
--stop update() from working during kana string
--furigana over old words
--gen json from migacc, remove \;(.*?)\]
-save preppedJson into src without prompt
--make sure that can take ruby from normal ebook formating
--generate readings for kanji with no ruby provided, but keep provided ruby
--switch to english mode for romaji


```
