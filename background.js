'use strict';

chrome.runtime.onInstalled.addListener(function() {
  // Start by loading any locally stored templates from previous sessions
  chrome.storage.sync.get(["storedTemplates"], function(templates) {
    console.log('Scrumlord running...');
    console.log('Stored teams:');
    console.log(templates);
  });
});
