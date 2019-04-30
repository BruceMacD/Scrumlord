'use strict';

let startBtn = document.getElementById('startBtn');
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

async function loadTeams() {
  chrome.storage.sync.get(["scrum-teams"], function(storedTeams) {
    var teams = storedTeams["scrum-teams"];
    for(var team in teams) {
      for (var member in teams[team]) {
        var newNode = new Node(currentNode, team, member, teams[team][member], null);
        if (currentNode === null) {
          firstNode = newNode;
          console.log(firstNode);
        } else {
          currentNode.next = newNode;
        }
        currentNode = newNode;
        console.log(currentNode);
      }
    }
  });
  return 1;
}

function updateDisplay() {
  team.innerHTML = currentNode.teamName;
  member.innerHTML = currentNode.personName;
  console.log(currentNode.link);
  chrome.tabs.update({
    // must be http://www.* format
    url: String(currentNode.link)
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// hide to start
title.style.display = "none";
navigation.style.display = "none";

startBtn.onclick = async function(element) {
  
  navigation.style.display = "inline";
  title.style.display = "inline";
  start.style.display = "none";

  await loadTeams();

  // gotta make sure the first node get set before continuing
  // ... an async waterfall would work too
  while (firstNode === null) {
    await sleep(1000);
  }
  currentNode = firstNode;
  updateDisplay();
};
