'use strict';

var centerContainer = document.getElementById('center-container');

function saveTeamName(oldTeamName, newTeamName) {
  chrome.storage.sync.get(["scrum-teams"], function(storedTeams) {
    var teams = storedTeams ? storedTeams["scrum-teams"] : {};
    console.log(teams);
    
    if (oldTeamName)
    {
      delete teams[oldTeamName];    
    }
    // new empty team
    teams[newTeamName] = [];

    // update the stored templates
    chrome.storage.sync.set({ "scrum-teams": teams }, function(){
      console.log("teams updated");
    });

    location.reload();
  });
}

function removeTeam(teamName) {
  chrome.storage.sync.get(["scrum-teams"], function(storedTeams) {
    var teams = storedTeams ? storedTeams["scrum-teams"] : {};
    delete teams[teamName];    

    chrome.storage.sync.set({ "scrum-teams": teams }, function(){
      console.log("teams updated");
    });

    location.reload();
  });
}

// add a new team input
function appendTeamInput(teamName) {
  var divGroup = document.createElement('div');
  divGroup.className = "input-group";

  var input = document.createElement('input');
  input.type = "text";
  input.className = "form-control";
  input.setAttribute('aria-label', "Team name");
  input.setAttribute('aria-describedby', "basic-addon2");
  if (teamName === "") {
    input.placeholder = "Team name";    
  } else {
    input.value = teamName;
  }
  divGroup.appendChild(input);

  var divGroupAppend = document.createElement('div');
  divGroupAppend.className = "input-group-append";
  divGroup.appendChild(divGroupAppend);

  var btnSave = document.createElement('button');
  btnSave.className = "btn btn-outline-secondary";
  btnSave.type = "button";
  btnSave.innerHTML = "Save";
  btnSave.onclick = function(element){
    // only save if there is a set value
    if (input.value)
    {
      saveTeamName(teamName, input.value);
    }
  }

  divGroupAppend.appendChild(btnSave);

  var btnRemove = document.createElement('button');
  btnRemove.className = "btn btn-outline-secondary";
  btnRemove.type = "button";
  btnRemove.innerHTML = "Remove";
  btnRemove.onclick = function(element){
    if (teamName)
    {
      removeTeam(teamName);
    }
  }
  divGroupAppend.appendChild(btnRemove);

  centerContainer.appendChild(divGroup);
}

// utility function for loading the stored team view
function loadTeamView(teams) {
  for(var teamName in teams) {
    appendTeamInput(teamName);
 }
  appendTeamInput("");
}

// load the stored teams
chrome.storage.sync.get(["scrum-teams"], function(storedTeams) {
  loadTeamView(storedTeams["scrum-teams"]);
});