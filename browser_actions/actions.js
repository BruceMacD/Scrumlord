'use strict';

let startBtn = document.getElementById('startBtn');
let start = document.getElementById('start');
let title = document.getElementById('title');
let navigation = document.getElementById('navigation');

// hide to start
title.style.display = "none";
navigation.style.display = "none";

startBtn.onclick = function(element) {
  chrome.tabs.update({
    url: "http://www.example.com/"
  });
  navigation.style.display = "inline";
  title.style.display = "inline";
  start.style.display = "none";
};
