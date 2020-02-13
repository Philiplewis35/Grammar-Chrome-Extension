chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // local = 'http://localhost:4567/'
  // heroku = 'https://parser3.herokuapp.com'
  //
  // url = local

 if (message.purpose && message.purpose === 'check grammar'){
   chrome.storage.sync.get(['grammar_services'], function(results) {
     responses = []

     production = results.grammar_services.services
     local = ['http://localhost:4567/analyse']

     $.each(local, function(index, service_url) {
       $.ajax({
         url: service_url,
         method: 'POST',
         data: message.data,
         async: false,
         success: function(r) {
           responses.push(r)
         }
       })

     });
     sendResponse(JSON.parse(responses))
   });
   return true
 };
});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.sync.set({grammar_services: request}, function() {});
  }
);
