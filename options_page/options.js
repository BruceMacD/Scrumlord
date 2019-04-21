'use strict';

var centerContainer = document.getElementById('centerContainer');

// add a new team input
function appendTeamInput(teamNum) {
  var divGroup = document.createElement('div');
  divGroup.className = "input-group";

  var input = document.createElement('input');
  input.type = "text";
  input.className = "form-control";
  input.placeholder = "Team name";
  input.setAttribute('aria-label', "Team name");
  input.setAttribute('aria-describedby', "basic-addon2");
  divGroup.appendChild(input);

  var divGroupAppend = document.createElement('div');
  divGroupAppend.className = "input-group-append";
  divGroup.appendChild(divGroupAppend);

  //TODO: add ids to buttons from team num for reference
  var btnSave = document.createElement('button');
  btnSave.className = "btn btn-outline-secondary";
  btnSave.type = "button";
  btnSave.innerHTML = "Save";
  divGroupAppend.appendChild(btnSave);

  var btnRemove = document.createElement('button');
  btnRemove.className = "btn btn-outline-secondary";
  btnRemove.type = "button";
  btnRemove.innerHTML = "Remove";
  divGroupAppend.appendChild(btnRemove);

  centerContainer.appendChild(divGroup);
}

// add a team input from an existing value
function appendExistingTeamInput(teamName, teamNum) {
  appendTeamInput(teamNum);
  // TODO: set the value of the input area
}

// utility function for loading the stored team view
function loadTeamView(teams) {
  if (teams.length) {
    // TODO: convert to Object.keys(teams).length
    var teamCount = teams.length;

    for(var i = 0; i < teamCount; i++) {
      //TODO: appendExistingTeamInput
    }
    appendTeamInput(teamCount + 1);
  } else {
    appendTeamInput(0);
  }
}

// load the stored teams
chrome.storage.sync.get(["teams"], function(teams) {
  loadTeamView(teams);
});