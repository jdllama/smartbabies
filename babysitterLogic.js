$(function() {
        let showTimer = 0;
        let suggestionTimer = -1;
        let mainIntervalHandle = null;
        //from https://stackoverflow.com/questions/31337370/how-to-convert-seconds-to-hhmmss-in-moment-js
        function pad(num) {
            return ("0"+num).slice(-2);
        }
        function hhmmss(secs) {
          var minutes = Math.floor(secs / 60);
          secs = secs%60;
          var hours = Math.floor(minutes/60)
          minutes = minutes%60;
          return `${pad(minutes)}:${pad(secs)}`;
          // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
        }

        //from https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
        function randomIntFromInterval(min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        }
        
        function getRandomFromArr(arr) {
          return arr[Math.floor(Math.random() * arr.length)];
        }
        
        /*
        let usedPrompts = [];
            
            let usedPromptChecker = (el) => {
              let i = 0;
              
            };
        */
        
        let usedPrompts = [];
        
        function getRandomFromArrPrompts(arr) {
          let i = 0;
          let ret = arr[Math.floor(Math.random() * arr.length)];
          while(usedPrompts.indexOf(ret) !== -1) {
            ret = arr[Math.floor(Math.random() * arr.length)];
          }
          usedPrompts.push(ret);
          console.log(usedPrompts);
          if(usedPrompts.length > 6) usedPrompts.shift();
          return ret;
        }
        
        function logit(str) {
          var mystr = `<p>${+(new Date())}: ${str}</p>`;
          $("#log").append($(mystr));
          
        }
      
        getRandomPrompt = function() {};
        
        prettify = function(str) {};
        
        let data = mainObj;          
          console.log(data);
          let emotions = data.emotions;
          let styles = data.styles;
          let timeWarps = data.timeWarps;
          let sounds = data.sounds;
          data.squad.forEach(player => {
            $(`<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" value="${player}" checked><label class="form-check-label">${player}</label></div>`).appendTo($("#theGang"));
          });
          $(`<div class="form-check form-check-inline"><input class="form-check-input" type="checkbox" value="Stranger"><label class="form-check-label">Stranger</label></div>`).appendTo($("#theGang"));
          $("#beginShow").click(function() {
            //document.documentElement.requestFullscreen();
            $("#settings").hide();
            $("#gameTime").show();
            $("#log").html("");
            let players = $("[type=checkbox]:checked").map(function() {
                return this.value;
            }).get();
            showTimer = parseInt($("#slideShow").val());
            $("#timeRemainingShow").html(hhmmss(showTimer));
            logit(hhmmss(showTimer));
            mainIntervalHandle = setInterval(function() {
                showTimer--;
                suggestionTimer--;
                if(showTimer <= 0) {
                  //showTimer = 0;
                  $("#timeRemainingShow").html("--:--:--");
                  clearInterval(mainIntervalHandle);
                  document.exitFullscreen(); 
                  responsiveVoice.speak(data.ending, "UK English Female", {rate: .9, onend: function() {
                    $("#settings").show();
                    $("#gameTime").hide();
                  }});
                }
                else if(showTimer == 60) {
                    suggestionTimer = -1;
                  responsiveVoice.cancel();
                    setTimeout(function() {
                      responsiveVoice.cancel();
                    responsiveVoice.speak(data.wrapup, "UK English Female", {rate: .9 });
                    }, 1000);
                    
                }
                else {
                  $("#timeRemainingShow").html(hhmmss(showTimer));
                }
                if(suggestionTimer == 0) {
                  $("#timeRemainingNextInterruption").html(hhmmss(0));
                  $("#alert").off("ended").on("ended", function() {
                    getRandomPrompt();
                  }).get(0).play();
                  
                }
                else if(suggestionTimer < 0) {
                  $("#timeRemainingNextInterruption").html("No more");
                }
                else {
                  $("#timeRemainingNextInterruption").html(hhmmss(suggestionTimer));
                }
            }, 1000);
            getRandomPrompt = function() {
              let randVal = Math.random();
              let myArr = null;
              let intro = null;
              //Oh man, it's audience time!
              if(parseFloat($("#audienceSlider").val()) === 0) {
                myArr = data.prompts.preprogrammed;
                intro = "babies. ";
              }
              else {
                if(randVal < parseFloat($("#audienceSlider").val())) {
                  myArr = data.prompts.audience; 
                  intro = "Audience. ";
                }
                else {
                  myArr = data.prompts.preprogrammed;
                  intro = "babies. ";
                }
              }
              
              
              let myPrompt = prettify(intro + getRandomFromArrPrompts(myArr));
              logit(myPrompt);
              responsiveVoice.speak(myPrompt, "UK English Female", {rate: .9, onend: function() {
                suggestionTimer = randomIntFromInterval($( "#slider-range" ).slider( "values", 0 ), $( "#slider-range" ).slider( "values", 1 ));
                logit("Suggestion Timer set to " + suggestionTimer);
              }});
              
            };
            
            prettify = function(str) {
              str = str.split("$alph");
              if(str.length > 1) {
                str = str.join(getRandomFromArr("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")));
              }
              else str = str.join("");
              
              str = str.split("$emotion");
              if(str.length > 1) {
                str = str.join(getRandomFromArr(emotions));
              }
              else str = str.join("");
              
              str = str.split("$player");
              if(str.length > 1) {
                str = str.join(getRandomFromArr(players));
              }
              else str = str.join("");
              
              str = str.split("$style");
              if(str.length > 1) {
                str = str.join(getRandomFromArr(styles));
              }
              else str = str.join("");
              
              str = str.split("$timeWarp");
              if(str.length > 1) {
                str = str.join(getRandomFromArr(timeWarps));
              }
              else str = str.join("");
              
              str = str.split("$sound");
              if(str.length > 1) {
                str = str.join(getRandomFromArr(sounds));
              }
              else str = str.join("");

              return str;
            };
            
            responsiveVoice.speak(data.intro, "UK English Female", {rate: .9, onend: function() {
              setTimeout(function() {
                responsiveVoice.speak(`Don't speak out of turn, babies.`, "UK English Female", {rate: .9, onend: function() {
                  var myPrompt = prettify(getRandomFromArr(data.prompts.startItOff));
                logit(`First prompt: ${myPrompt}`);
                responsiveVoice.speak(`Let's start with: Audience: ${myPrompt}`, "UK English Female", {rate: .9, onend: function() {
                  suggestionTimer = randomIntFromInterval($( "#slider-range" ).slider( "values", 0 ), $( "#slider-range" ).slider( "values", 1 ));
                  logit("Suggestion Timer set to " + suggestionTimer);
                }})
                }});
              }, 5000);
              
            }});
          });
          
          document.getElementById("slideShow").oninput = function() {
            //output.innerHTML = this.value;
            $("#showLength").val(hhmmss(this.value));
          }
          
          document.getElementById("slideShow").value = data.defaultShowLength;
          
          document.getElementById("slideShow").oninput();
          
          if(data.setValues == true) {
            $( "#slider-range" ).slider({
              range: true,
              min: 15,
              max: 180,
              values: [ data.defaultMinGap, data.defaultMaxGap ],
              slide: function( event, ui ) {
                $( "#gapRange" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
              }
            });
            $("#gapRange").val( $( "#slider-range" ).slider( "values", 0 ) +
			        " - " + $( "#slider-range" ).slider( "values", 1 ) );
          }
          else {
            $("[type=range], [type=checkbox]").hide();
            $( "#gapRange" ).val( data.defaultMinGap + " - " + data.defaultMaxGap );
          }
		
          
          
          
          
          document.getElementById("audienceSlider").oninput = function() {
            $("#audienceVal").val(Math.floor(this.value * 100) + "%");
          }
          
          document.getElementById("audienceSlider").value = data.prompts.audiencePercent;
          
          document.getElementById("audienceSlider").oninput();
        });
