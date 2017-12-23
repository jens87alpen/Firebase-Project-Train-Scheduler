//show the input in the table
//show local time
//minutes away
$(document).ready(function(){

 var config = {
    apiKey: "AIzaSyA38bWZWKM9u4eRhRA9B4lR2sfHuwQnBu8",
    authDomain: "train-schedule-55a57.firebaseapp.com",
    databaseURL: "https://train-schedule-55a57.firebaseio.com",
    projectId: "train-schedule-55a57",
    storageBucket: "",
    messagingSenderId: "629515803343"
  };
  firebase.initializeApp(config);

 
       var database = firebase.database();

    // Capture Button Click
    $("#submitButton").on("click", function(event) {
      event.preventDefault();
      
      // Code in the logic for storing and retrieving the most recent train.
      
      var newTrainName = $("#trainName").val().trim();
      var newDestination = $("#destination").val().trim();
      var newFrequency = $("#frequency").val().trim();
      var newFirstTrain = $("#firstTrain").val().trim();

      
      var newTrain = {
        trainName: newTrainName,
        destination: newDestination,
        frequency: newFrequency,
        firstTrain: newFirstTrain,
        timeAdded: firebase.database.ServerValue.TIMESTAMP
        
      };

      // Code for the push
      database.ref().push(newTrain);

      // $("#trainName").val("");
      // $("#destination").val("");
      // $("#frequency").val("");
      // $("#firstTrain").val("");
     
    });

       // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());
      
      var newTrainName = childSnapshot.val().trainName;
      var newDestination = childSnapshot.val().destination;
      var newFrequency = childSnapshot.val().frequency;
      var newFirstTrain = childSnapshot.val().firstTrain;

      // Current Time
       var currentTime = moment().format("hh:mm");//.format("hh:mm");
       console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
       $('#currentTime').text(currentTime);

       var newFrequency = parseInt(newFrequency);

       //FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME
        // var dConverted = moment(time,'hh:mm').subtract(1, 'years');
        // I only need the hour 
        var tConverted = moment(newFirstTrain, 'hh:mm').subtract(1, 'years');
        // console.log("DATE CONVERTED: " + dConverted);
        // var trainTime = moment(dConverted).format('hh:mm');
        // console.log("TRAIN TIME : " + trainTime);

        // var tConverted = moment(trainTime, 'hh:mm').subtract(1, 'years');
        //tConverted = dConverted;
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        console.log("DIFFERENCE IN TIME: " + tDifference);

        //REMAINDER 
        var tRemainder = tDifference % newFrequency;
        console.log("TIME REMAINING: " + tRemainder);
        //MINUTES UNTIL NEXT TRAIN
        var minsAway = newFrequency - tRemainder;
        console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
        //NEXT TRAIN
        var nextTrain = moment().add(minsAway, 'minutes');
        console.log("ARRIVAL TIME: " + moment(nextTrain).format('hh:mm'));
        

      // Log everything that's coming out of snapshot
      console.log(newTrainName);
      console.log(newDestination);
      console.log(newFrequency);
      console.log(newFirstTrain);


      //var rData = data.val();
      // full list of items to the well
     $("#train-table > tbody").append(
      "<tr><td>" + newTrainName + 
      "</td><td>" + newDestination + 
      "</td><td>" + newFrequency + 
      "</td><td id='nextDisplay'>" + moment(nextTrain).format("hh:mm") +
      "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
      });

 });

    
    