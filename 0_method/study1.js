// ############################## Helper functions ##############################

// Shows slides. We're using jQuery here - the **$** is the jQuery selector function, which takes as input either a DOM element or a CSS selector string.
function showSlide(id) {
  // Hide all slides
  $(".slide").hide();
  // Show just the slide we want to show
  $("#"+id).show();
}

// Get random integers.
// When called with no arguments, it returns either 0 or 1. When called with one argument, *a*, it returns a number in {*0, 1, ..., a-1*}. When called with two arguments, *a* and *b*, returns a random value in {*a*, *a + 1*, ... , *b*}.
function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}

// Add a random selection function to all arrays (e.g., <code>[4,8,7].random()</code> could return 4, 8, or 7). This is useful for condition randomization.
Array.prototype.random = function() {
  return this[random(this.length)];
}

// shuffle ordering of argument array -- are we missing a parenthesis?
function shuffle (a)
{
    var o = [];

    for (var i=0; i < a.length; i++) {
      o[i] = a[i];
    }

    for (var j, x, i = o.length;
         i;
         j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// from: http://www.sitepoint.com/url-parameters-jquery/
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
    return null;
  } else{
    return results[1] || 0;
  }
}

// ---------------------------------- Conditions and Trial Order --------------------------------------//
// trial names and youtube URL addresses. URL ending sets the video attributes: control=0 (no buttons), showinfo=0 (no text), rel=0, autoplay=1
var trials = {
    training1: ["training_ladybug_t","https://www.youtube.com/embed/WWOkUcLHtGg?controls=0&showinfo=0&rel=0&autoplay=1"],
    training2: ["training_sarah_f", "https://www.youtube.com/embed/4ahnw9GLyDg?controls=0&showinfo=0&rel=0&autoplay=1"],
    filler_rabbit_t: ["filler_rabbit_t","https://www.youtube.com/embed/BhJdqpXyE3c?controls=0&showinfo=0&rel=0&autoplay=1"],
    filler_rabbit_f: ["filler_rabbit_f","https://www.youtube.com/embed/6bf_dLK6hVM?controls=0&showinfo=0&rel=0&autoplay=1"],
    filler_pig_t: ["filler_pig_t","https://www.youtube.com/embed/Z9nrpUi0BJE?controls=0&showinfo=0&rel=0&autoplay=1"],
    filler_pig_f: ["filler_pig_f","https://www.youtube.com/embed/HfE-1Avyiz0?controls=0&showinfo=0&rel=0&autoplay=1"],
    filler_monkey_t: ["filler_monkey_t","https://www.youtube.com/embed/GFtF_VzhCB4?controls=0&showinfo=0&rel=0&autoplay=1"],
    filler_monkey_f: ["filler_monkey_f","https://www.youtube.com/embed/vINbqFH9YtA?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_0DT_monkey: ["simple_0DT_monkey","https://www.youtube.com/embed/dgLUPL1CMMg?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_0DT_pinguin: ["simple_0DT_pinguin","https://www.youtube.com/embed/SteaS--4RCg?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_1DT_chicken: ["simple_1DT_chicken","https://www.youtube.com/embed/TVe1M2gpAlE?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_1DT_monkey: ["simple_1DT_monkey","https://www.youtube.com/embed/YBEZ5vuhwKg?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_1DT_mouse: ["simple_1DT_mouse","https://www.youtube.com/embed/EQX4LsAodn0?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_1DT_sheep: ["simple_1DT_sheep","https://www.youtube.com/embed/RkTthqvxy6I?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_2DT_chicken: ["simple_2DT_chicken","https://www.youtube.com/embed/pfnNKyvvAIo?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_2DT_monkey: ["simple_2DT_monkey","https://www.youtube.com/embed/Dhvr_fvCwis?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_2DT_mouse: ["simple_2DT_mouse","https://www.youtube.com/embed/zLdLhMiOCDQ?controls=0&showinfo=0&rel=0&autoplay=1"],
    simple_2DT_rabbit: ["simple_2DT_rabbit","https://www.youtube.com/embed/0a_EHyy6BxQ?controls=0&showinfo=0&rel=0&autoplay=1"],    
    complex_0DT_monkey: ["complex_0DT_monkey","https://www.youtube.com/embed/Tb_xa15jFr4?controls=0&showinfo=0&rel=0&autoplay=1"],
    complex_0DT_pinguin: ["complex_0DT_pinguin","https://www.youtube.com/embed/2PhKJq6TWoA?controls=0&showinfo=0&rel=0&autoplay=1"],
    complex_1DT_chicken: ["complex_1DT_chicken","https://www.youtube.com/embed/xh3Yt-DOp_A?controls=0&showinfo=0&rel=0&autoplay=1"],
    complex_1DT_monkey: ["complex_1DT_monkey","https://www.youtube.com/embed/I98CZJ0R5cI?controls=0&showinfo=0&rel=0&autoplay=1"],
    complex_1DT_mouse: ["complex_1DT_mouse","https://www.youtube.com/embed/ms535ZuBrMQ?controls=0&showinfo=0&rel=0&autoplay=1"],
    complex_1DT_sheep: ["complex_1DT_sheep","https://www.youtube.com/embed/bbvl4J22fL4?controls=0&showinfo=0&rel=0&autoplay=1"],
    complex_2DT_chicken: ["complex_2DT_chicken","https://www.youtube.com/embed/MohcrCZX9LY?controls=0&showinfo=0&rel=0&autoplay=1"],
    complex_2DT_monkey: ["complex_2DT_monkey","https://www.youtube.com/embed/-qM3ebIjPr4?controls=0&showinfo=0&rel=0&autoplay=1"],
    complex_2DT_mouse: ["complex_2DT_mouse","https://www.youtube.com/embed/il6ythQB09A?controls=0&showinfo=0&rel=0&autoplay=1"],
    complex_2DT_rabbit: ["complex_2DT_rabbit","https://www.youtube.com/embed/rT03nKt_nhg?controls=0&showinfo=0&rel=0&autoplay=1"]
}

// The original study randomly presented one of the true or false fillers
var filler_rabbit = [trials.filler_rabbit_f, trials.filler_rabbit_t];
var filler_monkey = [trials.filler_monkey_f, trials.filler_monkey_t];
var filler_pig = [trials.filler_pig_f, trials.filler_pig_t];

// Condition = Simple ("or"), trial order A
var simpleA = [trials.training1, trials.training2, 
                trials.simple_1DT_chicken, trials.simple_2DT_rabbit, trials.simple_1DT_mouse, trials.simple_2DT_monkey,
                filler_monkey[Math.floor(Math.random() * filler_monkey.length)],
                trials.simple_0DT_pinguin, trials.simple_1DT_monkey, trials.simple_2DT_chicken,
                filler_rabbit[Math.floor(Math.random() * filler_rabbit.length)],
                trials.simple_0DT_monkey, trials.simple_2DT_mouse, trials.simple_1DT_sheep,
                filler_pig[Math.floor(Math.random() * filler_pig.length)]
               ];
// Condition = Simple ("or"), trial order B
var simpleB = [trials.training1, trials.training2,
               trials.simple_2DT_mouse, trials.simple_1DT_sheep, trials.simple_2DT_chicken, trials.simple_1DT_monkey,
               filler_pig[Math.floor(Math.random() * filler_pig.length)],
               trials.simple_0DT_pinguin, trials.simple_2DT_monkey, trials.simple_1DT_mouse,
               filler_rabbit[Math.floor(Math.random() * filler_rabbit.length)],
               trials.simple_0DT_monkey, trials.simple_1DT_chicken, trials.simple_2DT_rabbit,
               filler_monkey[Math.floor(Math.random() * filler_monkey.length)],          
              ];

// Condition = Complex ("either-or"), trial order A
var complexA = [trials.training1, trials.training2, 
                trials.complex_1DT_chicken, trials.complex_2DT_rabbit, trials.complex_1DT_mouse, trials.complex_2DT_monkey,
                filler_monkey[Math.floor(Math.random() * filler_monkey.length)],
                trials.complex_0DT_pinguin, trials.complex_1DT_monkey, trials.complex_2DT_chicken,
                filler_rabbit[Math.floor(Math.random() * filler_rabbit.length)],
                trials.complex_0DT_monkey, trials.complex_2DT_mouse, trials.complex_1DT_sheep,
                filler_pig[Math.floor(Math.random() * filler_pig.length)]
               ];

// Condition = Complex ("either-or"), trial order B
var complexB = [trials.training1, trials.training2,
               trials.complex_2DT_mouse, trials.complex_1DT_sheep, trials.complex_2DT_chicken, trials.complex_1DT_monkey,
               filler_pig[Math.floor(Math.random() * filler_pig.length)],
               trials.complex_0DT_pinguin, trials.complex_2DT_monkey, trials.complex_1DT_mouse,
               filler_rabbit[Math.floor(Math.random() * filler_rabbit.length)],
               trials.complex_0DT_monkey, trials.complex_1DT_chicken, trials.complex_2DT_rabbit,
               filler_monkey[Math.floor(Math.random() * filler_monkey.length)],          
              ];

//Set of 4 possible condition-order assignment
var conditions = [simpleA, simpleB, complexA, complexB];
//Randomly assign the participant to one of the conditions
var order = Math.floor(Math.random() * conditions.length)

if (order==0 || order==2) {
    var trial_order = "A";
} else { var trial_order = "B"}

var condition = conditions[order];
//Total number of trials
var totalTrials = condition.length;

// ############################## The Experiment Code and Functions ##############################

// Show the first slide
showSlide("instructions");

var experiment = {

// DATA: The data structure that records the responses to be sent to mTurk
    data: {
        audioTest: [], //the word "language" we asked participants to type in as an audio test
        age: [],
        gender: [],
        education: [],
        version: [],
        trial: [], // what trial/video was presented to the participant
        response: [], // response
        elapsed_ms: [], // time taken to provide an answer
        num_errors: [], // number of times participant attempted to go to the next slide without providing an answer
        expt_aim: [], // participant's comments on the aim of the study
        expt_gen: [], // participant's general comments
        language: [], // what is the native language of the participant
        user_agent: [],
        window_width: [],
        window_height: [],
    },

    start_ms: 0,  // time current trial started ms
    num_errors: 0,    // number of errors so far in current trial
    
    
// END FUNCTION: The function to call when the experiment has ended
    end: function() {
      showSlide("finished");
      setTimeout(function() {
        turk.submit(experiment.data)
      }, 1500);
    },

// LOG FUNCTION: the function that records the responses
    log_response: function() {
      var response_logged = false;
      var elapsed = Date.now() - experiment.start_ms;

      //Array of radio buttons
      var radio = document.getElementsByName("judgment");

      // Loop through radio buttons
      for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
          experiment.data.response.push(radio[i].value);
          experiment.data.elapsed_ms.push(elapsed);
          experiment.data.num_errors.push(experiment.num_errors);
          response_logged = true;
        }
      }

      if (response_logged) {
        nextButton.blur();

        // uncheck radio buttons
        for (i = 0; i < radio.length; i++) {
          radio[i].checked = false
        }

        $('#stage-content').hide();
        experiment.next();
      } else {
          experiment.num_errors += 1;
          $("#testMessage").html('<font color="red">' +
               'Please make a response!' +
               '</font>');
      }
    },

// NEXT FUNCTION: The work horse of the sequence - what to do on every trial.
    next: function() {
      // Allow experiment to start if it's a turk worker OR if it's a test run
      if (window.self == window.top | turk.workerId.length > 0) {
          $("#testMessage").html('');   // clear the test message
          $("#prog").attr("style","width:" +
              String(100 * (1 - condition.length/totalTrials)) + "%")
          // style="width:progressTotal%"
          window.setTimeout(function() {
            $('#stage-content').show();
            experiment.start_ms = Date.now();
            experiment.num_errors = 0;
          }, 150);

          // Get the current trial - <code>shift()</code> removes the first element
          // select from our scales array and stop exp after we've exhausted all the domains
          var current_trial = condition.shift();

          //If the current trial is undefined, call the end function.
          if (typeof current_trial == "undefined") {
            return experiment.debriefing();
          }

          // Display the sentence stimuli
          // var face_filename = getFaceFile(face_dft);
          
          $("#face").attr('src', current_trial[1]);


          // push all relevant variables into data object
          experiment.data.trial.push(current_trial[0]);
          experiment.data.window_width.push($(window).width());
          experiment.data.window_height.push($(window).height());

          showSlide("stage");
      }
    },

    //  go to debriefing slide
    debriefing: function() {
      showSlide("debriefing");
    },

    // submitcomments function
    submit_comments: function() {
        experiment.data.age.push(document.getElementById("age").value);
        experiment.data.gender.push(document.getElementById("gender").value);
        experiment.data.education.push(document.getElementById("education").value);
        experiment.data.expt_aim.push(document.getElementById("expthoughts").value);
        experiment.data.expt_gen.push(document.getElementById("expcomments").value);
        experiment.data.language.push(document.getElementById("explanguage").value);
        experiment.data.user_agent.push(window.navigator.userAgent);
        experiment.data.version.push(trial_order);
        experiment.end();
    }
}

$(function() {
  $('form#demographics').validate({
    rules: {
      "age": "required",
      "gender": "required",
      "education": "required",
//      "race[]": "required",
    },
    messages: {
      "age": "Please choose an option",
      "gender": "Please choose an option",
      "education": "Please choose an option",
    },
    submitHandler: experiment.submit_comments
  });
});
