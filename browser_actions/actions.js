'use strict';

let startBtn = document.getElementById('startBtn');
let start = document.getElementById('start');
let title = document.getElementById('title');
let navigation = document.getElementById('navigation');
let team = document.getElementById('teamName');
let member = document.getElementById('member');

var teams = {};
var currentTeam = {};

function loadNext() {
  if (currentTeam.length === 0) {
    // team = next team
  }
  team.innerHTML = "test";
  team.innerHTML = "test";

  chrome.tabs.update({
    url: "http://www.example.com/"
  });
}

// hide to start
title.style.display = "none";
navigation.style.display = "none";

startBtn.onclick = function(element) {
  
  navigation.style.display = "inline";
  title.style.display = "inline";
  start.style.display = "none";

  chrome.storage.sync.get(["scrum-teams"], function(storedTeams) {
    teams = storedTeams["scrum-teams"];
  });

  console.log(teams[0]);
};
