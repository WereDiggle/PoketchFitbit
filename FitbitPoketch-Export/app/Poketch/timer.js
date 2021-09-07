// Import the fitbit builtins

// Define any helper functions
import * as utils from "../../common/utils";

// Define this module
export let KitchenTimer = function(doc) {
  // Fetch the digit handler
  let digitHandler = new utils.DigitDisplay(doc, "timer_", "0000", "digit_shadow");

  // Snorlax image
  let snorlax = doc.getElementById("timer_snorlax");

  // Bottom buttons (Aesthetic)
  let strtBut = doc.getElementById("timer_start_button");
  let stopBut = doc.getElementById("timer_stop_button");
  let restBut = doc.getElementById("timer_reset_button");
  // Bottom buttons (activated)
  let strtBt = doc.getElementById("timer_start_but");
  let stopBt = doc.getElementById("timer_stop_but");
  let restBt = doc.getElementById("timer_reset_but");
  // Change the layer height
  utils.changeLayer(strtBt, 120);
  utils.changeLayer(stopBt, 121);
  utils.changeLayer(restBt, 122);
  utils.animateElement(stopBut, "select");

  // Timer variable
  let timerVar = 0;
  let startTimer = false;

  // Function to replace the snorlax href
  let snorlaxHref = function(text="down") {
    snorlax.href = snorlax.href.splice(snorlax.href.indexOf("_")+1, snorlax.href.indexOf("."), text);
  };

  // Function to convert a time in seconds to the digit handler
  let sec2string = function(times=10) {
    let secs = times % 60; let mins = ~~(times / 60);
    // set the string
    return ~~(mins / 10) + "" + mins % 10 + "" + ~~(secs / 10) + "" + secs % 10;
  };

  // function to draw the display
  this.draw = function() {
    digitHandler.update(sec2string(timerVar));
  };

  // Function to draw the snorlax when the timer has finished
  let timerEnd = function(left = true) {
    // If we haven't pressed stop
    if (startTimer) {
      // update the snorlax image
      snorlaxHref(left ? "left" : "right");
      // and set a timeout to call the function again
      setTimeout(function() {
        timerEnd(!left);
      }, 250);
    };
  };

  // Function to reduce the timer
  let timerLoop = function() {
    // If the timer is not at zero
    if (timerVar > 0) {
      // create a timeout function
      setTimeout(function() {
        // if we are still running
        if (startTimer) {
          // Decrement the timer
          timerVar--;
          // update the display
          digitHandler.update(sec2string(timerVar));
          // and execute again
          timerLoop();
        };
      }, 1000);
    } else {
      timerEnd();
    };
  };

  // function that executes on the start button press
  let startPress = function(startPress = false) {
    // activate the buttons
    utils.animateElement(strtBut, startPress ? "select" : "unselect");
    utils.animateElement(stopBut, startPress ? "unselect" : "select");
    // Change the snorlax image
    snorlaxHref(startPress ? "down" : "up");
    // set the start timer to false if the press is false
    if(!startPress) { startTimer = false; };
  };

  // Event listeners
  // Start click
  strtBt.addEventListener("click", (evt) => {
    // Update the buttons
    buttonPress(true);
    // start the timer if we haven't already
    if (!startTimer && timerVar > 0) { startTimer = true; timerLoop(); };
  });
  // Stop click
  stopBt.addEventListener("click", (evt) => {
    // activate the buttons
    buttonPress(false);
  });
  // Reset click
  restBt.addEventListener("click", (evt) => {
    // activate the buttons
    utils.animateElement(restBut, "click");
    // deal with the other button stuff too
    buttonPress(false);
    // set the timerVariable.
    timerVar = 10;
    this.draw();
  });
};
