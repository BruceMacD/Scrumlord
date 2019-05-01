'use strict';

let startBtn = document.getElementById('startBtn');
let nextBtn = document.getElementById('nextBtn');
let prevBtn = document.getElementById('prevBtn');
let start = document.getElementById('start');
let title = document.getElementById('title');
let navigation = document.getElementById('navigation');
let team = document.getElementById('teamName');
let member = document.getElementById('member');

var firstNode = null;
var currentNode = null;

// a node in a linked list of team members
function Node(prev, teamName, personName, link, next) {
  this.prev = prev;
  this.teamName = teamName;
  this.personName = personName;
  this.link = link;
  this.next = next;
}

function updateDisplay() {
  currentNode.next === null ? nextBtn.disabled = true : nextBtn.disabled = false;
  currentNode.prev === null ? prevBtn.disabled = true : prevBtn.disabled = false;  

  team.innerHTML = currentNode.teamName;
  member.innerHTML = currentNode.personName;
  chrome.tabs.update({
    // must be http://www.* format
    url: String(currentNode.link)
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
    var teams = storedTeams["scrum-teams"];
    for(var team in teams) {
      for (var member in teams[team]) {
        var newNode = new Node(currentNode, team, member, teams[team][member], null);
        if (currentNode === null) {
          firstNode = newNode;
        } else {
          currentNode.next = newNode;
        }
        currentNode = newNode;
      }
    }

    currentNode = firstNode;
    updateDisplay();
  });
};

nextBtn.onclick = function(element) {
  currentNode = currentNode.next;
  updateDisplay();
};

prevBtn.onclick = function(element) {
  currentNode = currentNode.prev;
  updateDisplay();
};
