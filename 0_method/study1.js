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

// shuffle function - from stackoverflow?
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

// ############################## Configuration settings ##############################
var faces = [];
var NUM_TRIALS_PER_DFT = 1; // Number of times each stimulus is shown
for (var i = 0; i < NUM_TRIALS_PER_DFT; i++) { // populates the list "faces" with as many stimuli names as trials needed
  for (var dft = 1; dft <= 15; dft++) { // gatehering the number component of the stimuli file names
    faces.push(dft); 
  }
}

function getFaceFile(dft) {
  return 'images/video' + dft + '.mp4';
}

faces = shuffle(faces);

var totalTrials = faces.length;

// Initialize trial to trustworthy or attractive
//var type = Math.random();
//if (type >= 0.5) {
//  type = 'attractive';
//  $('.attractiveness-instr').show();
//  $('.trustworthy-instr').hide();
//} else {
//  type = 'trustworthy';
  $('.attractiveness-instr').hide();
  $('.trustworthy-instr').show();
//}


// ############################## The Experiment Code and Functions ##############################

// Show the first slide
showSlide("instructions");

var experiment = {

// The data structure that records the responses to be sent to mTurk
    data: {
//      type: [],
      age: [],
      gender: [],
      education: [],
//      race: [],
      trial: [], // what trial/video was presented to the participant
      rating: [], // response
      elapsed_ms: [], // time taken to provide an answer
      num_errors: [], // number of times participant attempted to go to the next slide without providing an answer
      expt_aim: [], // participant's comments on the aim of the study
      expt_gen: [], // participant's general comments
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

// LOG RESPONSE
    log_response: function() {
      var response_logged = false;
      var elapsed = Date.now() - experiment.start_ms;

      //Array of radio buttons
      var radio = document.getElementsByName("judgment");

      // Loop through radio buttons
      for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
          experiment.data.rating.push(radio[i].value);
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
              String(100 * (1 - faces.length/totalTrials)) + "%")
          // style="width:progressTotal%"
          window.setTimeout(function() {
            $('#stage-content').show();
            experiment.start_ms = Date.now();
            experiment.num_errors = 0;
          }, 150);

          // Get the current trial - <code>shift()</code> removes the first element
          // select from our scales array and stop exp after we've exhausted all the domains
          var face_dft = faces.shift();

          //If the current trial is undefined, call the end function.
          if (typeof face_dft == "undefined") {
            return experiment.debriefing();
          }

          // Display the sentence stimuli
          var face_filename = getFaceFile(face_dft);
          $("#face").attr('src', face_filename);


          // push all relevant variables into data object
          experiment.data.trial.push(face_dft);
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
//      var races = document.getElementsByName("race[]");
//      for (i = 0; i < races.length; i++) {
//        if (races[i].checked) {
//          experiment.data.race.push(races[i].value);
//        }
//      }
      experiment.data.age.push(document.getElementById("age").value);
      experiment.data.gender.push(document.getElementById("gender").value);
      experiment.data.education.push(document.getElementById("education").value);
      experiment.data.expt_aim.push(document.getElementById("expthoughts").value);
      experiment.data.expt_gen.push(document.getElementById("expcomments").value);
//      experiment.data.type.push(type);
      experiment.data.user_agent.push(window.navigator.userAgent);
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
//  $('#race_group input[value=no_answer]').click(function() {
//    $('#race_group input').not('input[value=no_answer]').attr('checked', false);
//  });
//  $('#race_group input').not('input[value=no_answer]').click(function() {
//    $('#race_group input[value=no_answer]').attr('checked', false);
//  });
});