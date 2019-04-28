'use strict';

var membersContainer = document.getElementById('members');
var teamsContainer = document.getElementById('teams');
var teamsBtn = document.getElementById('teamsBtn');
var memberBtn = document.getElementById('membersBtn');

// working storage of teams to members
var teamToMember = {}

function saveTeamName(oldTeamName, newTeamName) {
  chrome.storage.sync.get(["scrum-teams"], function(storedTeams) {
    var teams = storedTeams ? storedTeams["scrum-teams"] : {};
    
    if (oldTeamName)
    {
      delete teams[oldTeamName];    
    }
    // new empty team
    teams[newTeamName] = {};

    // update the stored templates
    chrome.storage.sync.set({ "scrum-teams": teams }, function(){
      console.log("teams updated");
    });

    location.reload();
  });
}

function updateTeamMembers()
{
  chrome.storage.sync.get(["scrum-teams"], function(storedTeams) {
    var teams = storedTeams ? storedTeams["scrum-teams"] : {};    
    console.log(teams);
    console.log(teamToMember);
    for(var team in teamToMember) {
      try {
        teams[team] = JSON.parse(teamToMember[team]);
      } catch(e) {
        console.log("unable to parse: " + team)
      }
    }

    chrome.storage.sync.set({ "scrum-teams": teams }, function(){
      console.log("teams updated");
    });
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

  teamsContainer.appendChild(divGroup);
}

// add a new team member input
function appendTeamMemberInput(teamName, members) {
  teamToMember[teamName] = members;

  var divGroup = document.createElement('div');
  divGroup.className = "input-group";

  var divPrepend = document.createElement('div');
  divPrepend.className = "input-group-prepend";

  var span = document.createElement('span');
  span.className = "input-group-text";
  span.innerHTML = teamName;

  divPrepend.appendChild(span);
  divGroup.appendChild(divPrepend);

  var textArea = document.createElement('textarea');
  textArea.className = "form-control";
  textArea.setAttribute('aria-label', "With textarea");
  if (JSON.stringify(members) === "{}") {
    textArea.placeholder = "{\"name\": \"link\"}";    
  } else {
    textArea.value = JSON.stringify(members);
  }
  textArea.onchange = function(element){
    teamToMember[teamName] = textArea.value;
  }
  
  divGroup.appendChild(textArea);

  membersContainer.appendChild(divGroup);  
}

// utility function for loading the stored team view
function loadTeamView(teams) {
  for(var teamName in teams) {
    appendTeamInput(teamName);
  }
  appendTeamInput("");
}

// utility function for loading the stored members view, will be empty if no teams
function loadMemberView(teams) {
  for(var teamName in teams) {
    appendTeamMemberInput(teamName, teams[teamName]);
  }

  // append save button
  var saveBtn = document.createElement('button');
  saveBtn.type = "button";
  saveBtn.className = "btn btn-primary";
  saveBtn.innerHTML = "Save";
  saveBtn.onclick = function(element){
    updateTeamMembers();
  }

  membersContainer.appendChild(saveBtn);
}

// load the stored teams
chrome.storage.sync.get(["scrum-teams"], function(storedTeams) {
  loadTeamView(storedTeams["scrum-teams"]);
});

teamsBtn.onclick = function(element) {
  // refreshing sets view back to teams active
  location.reload();
};

membersBtn.onclick = function(element) {
  membersContainer.style.display = "inline";
  teamsContainer.style.display = "none";
  teamsBtn.className = "nav-link";
  memberBtn.className = "nav-link active";
  
  chrome.storage.sync.get(["scrum-teams"], function(storedTeams) {
    loadMemberView(storedTeams["scrum-teams"]);
  });
};