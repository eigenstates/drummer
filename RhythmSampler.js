/*
 * Copyright 2013 Boris Smus. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var RhythmSample = function() {
  loadSounds(this, {
    kick: 'kick.wav',
    snare: 'snare.wav',
    hihat: 'hi-hat.wav'
  });
};

var rhythmIndex = 0,
    noteTime = 0.0,
    startTime,
    tempo = 80;

var currentBassPattern,
    currentSnarePattern,
    currentHihatPattern


function pickRandomPattern(){
  var rnd = Math.random();
    var pattern = 0
    if(rnd> .6 && rnd <.9)
    {
      pattern = 1
    }
    if (rnd > .9){
      pattern = 2
    }

    return pattern;
}

RhythmSample.prototype.play = function() {
  // Half note               =  120 / BPM
  // Quarter note            =   60 / BPM
  // Eighth note             =   30 / BPM
  // Sixteenth note          =   15 / BPM
  // Dotted-quarter note     =   90 / BPM
  // Dotted-eighth note      =   45 / BPM
  // Dotted-sixteenth note   = 22.5 / BPM
  // Triplet-quarter note    =   40 / BPM
  // Triplet-eighth note     =   20 / BPM
  // Triplet-sixteenth note  =   10 / BPM

  rhythmIndex = 0;
  noteTime = 0.0;
  startTime = context.currentTime + 0.005;
  currentBassPattern = pickRandomPattern();
  currentHihatPattern = pickRandomPattern();
  currentSnarePattern =pickRandomPattern();
  schedule();

};
RhythmSample.prototype.stop = function() {
  cancelAnimationFrame(timeoutId);
  timeoutId = null;

}

var kickPatterns = [
                    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
                    [1,0,1,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
                    [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0]
                   ]

var snarePatterns = [ 
                      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
                      [0,0,0,0, 1,0,0,0, 0,0,1,0, 1,0,0,0],
                      [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]
                    ]
var hihatPatterns = [ 
                      [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1],
                      [1,1,1,1, 0,1,1,1, 0,1,1,1, 0,1,1,1],
                      [1,1,1,1, 0,1,1,1, 0,1,1,1, 1,0,1,1]
                    ]

var LOOP_LENGTH = 16;
function schedule() {
  var currentTime = context.currentTime;

  // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
  currentTime -= startTime;

  while (noteTime < currentTime + 0.200) {
      var contextPlayTime = noteTime + startTime;
      if(kickPatterns[currentBassPattern][rhythmIndex] == 1){
          var t = Math.random();
          var sliderValue = document.querySelector('#bsswing').value
          var bsTime = contextPlayTime
          if(t> .5){
            bsTime += (sliderValue * .001) 
          }
          else{
            bsTime += (sliderValue * .01) 
          }
          playSound(dumMachine.kick, bsTime);
      }
      if(snarePatterns[currentSnarePattern][rhythmIndex] == 1){
          var t = Math.random();
          var sliderValue = document.querySelector('#snswing').value
          var snTime = contextPlayTime
          if(t> .5){
            snTime += (sliderValue * .001) 
          }
          else{
            snTime += (sliderValue * .01) 
          }
          playSound(dumMachine.snare, snTime);
      }
      if(hihatPatterns[currentHihatPattern][rhythmIndex] == 1){
          var t = Math.random();
          var sliderValue = document.querySelector('#hhswing').value
          var hhtime = contextPlayTime
          if(t> .5){
            hhtime += (sliderValue * .001) 
          }
          else{
            hhtime += (sliderValue * .01) 
          }      
          playSound(dumMachine.hihat, hhtime);
      }

      advanceNote();
  }

  timeoutId = requestAnimationFrame(schedule)
}

function advanceNote() {
    var secondsPerBeat = 60.0 / tempo;
    rhythmIndex++;
    if (rhythmIndex == LOOP_LENGTH) {    
        currentBassPattern = pickRandomPattern();
        currentHihatPattern = pickRandomPattern();
        currentSnarePattern = pickRandomPattern();
        rhythmIndex = 0;
    }

    noteTime += 0.25 * secondsPerBeat

}