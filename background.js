chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.purpose && message.purpose === 'check grammar'){
   chrome.storage.sync.get(['grammar_services'], function(results) {
     responses = []

     production = results.grammar_services.services
     local = ['http://localhost:4567/analyse', 'http://localhost:5678/analyse']

     $.each(local, function(index, service_url) {
       $.ajax({
         url: service_url,
         method: 'POST',
         data: message.data,
         async: false,
         success: function(r) {
           responses.push(JSON.parse(r))
         }
       })

     });

     sendResponse(responses)
   });
   return true
 };
});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.sync.set({grammar_services: request}, function() {});
  }
);
