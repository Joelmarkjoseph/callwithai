import { GoogleGenerativeAI } from "@google/generative-ai";

document.addEventListener('DOMContentLoaded', function() {

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
  const utterance = new SpeechSynthesisUtterance();
  utterance.lang = 'en-US';
  utterance.rate = 1.3;

  function submitted(inp) {
    const message = inp;
    runModel(message);
  }

  async function runModel(prompt = "") {
    try {
      const API_KEY = "AIzaSyA2VqV1q-P4QQOcYcm1AdWPJka6CxViAaw";
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt + " (answer with little short message but don't use any emojis and also remember that your name is ROSEY)");
      const response = result.response.text();
      console.log(response);
      speak(response);
      playVideoContinuously();
    } catch (error) {
      console.error('Error generating content:', error);
    }
  }

  function speak(inputText) {
    utterance.text = inputText;
    speechSynthesis.speak(utterance);

    utterance.addEventListener('end', function() {
      video.pause();
      video.currentTime = 0;
      startListening();
    });
  }

  function playVideoContinuously() {
    video.currentTime = 0;
    video.addEventListener('ended', function() {
      video.currentTime = 0;
      video.play();
    });

    video.play();
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
  document.getElementById("cutcbtn").onclick= function() {
    window.close();
  }
});
