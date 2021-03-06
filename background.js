'use strict';

chrome.runtime.onInstalled.addListener(function() {
  // Start by loading any locally stored templates from previous sessions
  chrome.storage.sync.get(["scrum-teams"], function(teams) {
    console.log('Scrumlord running...');
    console.log('Stored teams:');
    console.log(teams);
  });
});
