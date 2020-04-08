chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.purpose && message.purpose === 'check grammar'){
   responses = []

   chrome.storage.local.get(['gc_services'], function(r){
     if(r['gc_services'] == null) {
       sendResponse('signed out')
     } else if(r['gc_services'].length == 0) {
       sendResponse('empty')
     } else {
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
       sendResponse(responses)
     }
   })
   return true
 };
});
