chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.purpose && message.purpose === 'check grammar'){
   responses = []

   chrome.storage.sync.get(['gc_services'], function(r){
     $.each(r['gc_services'], function(index, service_url) {
       $.ajax({
         url: service_url + '/analyse',
         method: 'POST',
         data: message.data,
         async: false,
         success: function(r) {
           responses.push(JSON.parse(r))
         }
       })

     });
     console.log(responses)
     sendResponse(responses)
   })
   return true
 };
});
