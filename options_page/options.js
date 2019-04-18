'use strict';

let addNewTemplate = document.getElementById('addNewTemplate');
let saveTemplate = document.getElementById('saveTemplate');
let newTemplate = document.getElementById('newTemplate');
let templateText = document.getElementById('template');
let templateTitle = document.getElementById('title');
let cancelButton = document.getElementById('cancelButton');

// set when an entry that exists is edited
var update = false;

// hide to start
newTemplate.style.display = "none";

var templateContainer = document.getElementById('templateContainer');

// iterates over array and does not add entries with specified title
function removeEntry(entries, title) {
  // iteratively search for template with title and remove it
  // there shouldn't be that many templates so this is OK
  var newEntries = [];
  // only add back into entries if it is not the one being deleted
  for (var i = 0; i < entries.length; i++) {
    if (entries[i].title != title) {
      newEntries.push(entries[i]);
    }
  }

  return newEntries;
}

// utility function for deleting stored templates
function deleteTemplate(title) {
  chrome.storage.sync.get(["templates"], function(storedTemplates) {
    var entries = storedTemplates.templates;

    var newEntries = removeEntry(entries, title);

    // update the stored templates
    chrome.storage.sync.set({ "templates": newEntries }, function(){
      console.log("templates updated");
    });

    location.reload();
  });
}

// utility function for updating stored templates
function updateTemplateText(title, val) {
  chrome.storage.sync.get(["templates"], function(storedTemplates) {
    var entries = storedTemplates.templates;

    var newEntries = removeEntry(entries, title);

    // update the stored templates
    chrome.storage.sync.set({ "templates": newEntries }, function(){
      console.log("templates updated");
      updateStoredTemplates(title, val);
    });
  });
}

// utility function for updating templates in local storage
function updateStoredTemplates(title, val) {
  // save the values to local storage
  chrome.storage.sync.get(["templates"], function(storedTemplates) {
    var entries = storedTemplates.templates;
    var newEntry = {
      "title": title,
      "template": val
    };
    entries.push(newEntry);

    chrome.storage.sync.set({ "templates": entries }, function(){
      console.log("templates updated");
    });
  });

  location.reload();
}

// utility function for creating stored templates
function createTemplate() {
  // get the values
  var titleVal = title.value;
  var templateVal = template.value;

  title.classList.remove("is-invalid");
  template.classList.remove("is-invalid");

  if (titleVal === "" || templateVal === "") {
    if (titleVal === "") {
      title.classList.add("is-invalid");
    }
    if (templateVal === "") {
      template.classList.add("is-invalid");
    }
  } else {
    // remove the old entry if updating
    if (update) {
      // this will update the templates with the new value after deletion
      updateTemplateText(titleVal, templateVal);
    } else {
      // dont need to delete an existing value
      updateStoredTemplates(titleVal, templateVal);
    }
  }
}

// load the stored templates as buttons
chrome.storage.sync.get(["templates"], function(storedTemplates) {

  var templateCount = Object.keys(storedTemplates.templates).length;
  // populate the container with template buttons
  for(var i = 0; i < templateCount; i++) {
    var temp = storedTemplates.templates[i];

    var div = document.createElement("div");
    templateContainer.appendChild(div);

    // create the button for the template entry
    var button = document.createElement('button');
    button.className = "btn btn-info";
    button.innerHTML = temp.title;
    button.value = temp.template;
    button.id = "templateButton";
    button.onclick = function(element){
      // show dialog
      newTemplate.style.display = "inline";
      addNewTemplate.style.display = "none";

      // set to existing values
      update = true;
      title.value = element.target.innerHTML;
      template.value = element.target.value;
      title.readOnly = true;
    }

    // create a button to delete the given template
    var deleteButton = document.createElement('button');
    deleteButton.className = "btn btn-danger";
    deleteButton.innerHTML = "X";
    deleteButton.value = temp.title;
    deleteButton.id = "deleteButton";
    deleteButton.onclick = function(element){
      deleteTemplate(element.target.value);
    }

    // add the buttons to the view
    templateContainer.appendChild(button);
    templateContainer.appendChild(deleteButton);
  };
});

addNewTemplate.onclick = function(element) {
  // show dialog
  newTemplate.style.display = "inline";
  addNewTemplate.style.display = "none";
};

saveTemplate.onclick = function(element) {
  createTemplate(update);
};

cancelButton.onclick = function(element) {
  location.reload();
};
