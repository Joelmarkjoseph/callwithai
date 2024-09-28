import { GoogleGenerativeAI } from "@google/generative-ai";

document.addEventListener('DOMContentLoaded', function() {

  // Get 'name' parameter from the URL and save it in a variable
  const urlParams = new URLSearchParams(window.location.search);
  const nameParam = urlParams.get('name') || "User"; // Default to "User" if no name is provided
  console.log('Name from URL:', nameParam);
  let spkr="";
  async function startWebcam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      document.getElementById('webcam').srcObject = stream;
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  startWebcam();

  const video = document.getElementById("myVideo");
  const videoSource = document.getElementById("videoSource");
  const utterance = new SpeechSynthesisUtterance();
  utterance.lang = 'en-US';
  utterance.rate = 1.3;

  // Detect device width and set the video source accordingly
  function setVideoSource() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) {
      videoSource.src = "cindrella.mp4"; // Replace with the mobile video file
      spkr="cindrella";
    } else {
      // Desktop screen
      videoSource.src = "Man.mp4"; // Replace with the desktop video file
      spkr="John";
    }
    video.load(); // Reload the video with the new source
  }

  setVideoSource();

  function submitted(inp) {
    const message = inp;
    runModel(message);
  }

  window.onload = runModel(`Hi ${nameParam}! Welcome to the app`);

  async function runModel(prompt) {
    try {
      const API_KEY = "AIzaSyCCODmV0aY2i9YLzl4k3I5ya9mygEi_85U";
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt + " (answer with a short message, don't use emojis, and remember your name is "+spkr+" and my name is " + nameParam + ")");
      const response = result.response.text();
      console.log(response);
      speak(response);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  }

  function speak(inputText = "") {
    utterance.text = inputText;

    // When the speech starts, play the video
    utterance.onstart = function() {
      video.currentTime = 0;
      video.play();
    };

    // When the speech ends, pause the video and reset
    utterance.onend = function() {
      video.pause();
      video.currentTime = 0;
      startListening();
    };

    speechSynthesis.speak(utterance);

    // Append spoken text to the textarea
    const spokenTextArea = document.getElementById("spoken-text");
    spokenTextArea.value += inputText + "\n"; // Append new line for each response
  }

  document.getElementById("listenn").onclick = function() {
    startListening();
  };

  function startListening() {
    document.getElementById("micc").style.padding = "10px";
    document.getElementById("micc").style.borderRadius = "10px";
    document.getElementById("micc").style.backgroundColor = "red";
    console.log("Listening..........");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      submitted(transcript);
    };

    recognition.onerror = function(event) {
      console.error("Speech recognition error detected: " + event.error);
    };

    recognition.onend = function() {
      console.log("Speech recognition ended.");
      document.getElementById("micc").style.backgroundColor = "white";
      document.getElementById("micc").style.padding = "0px";
    };

    recognition.start();
  }

  document.getElementById("cutcbtn").onclick = function() {
    window.close();
  }

});
