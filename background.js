chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
 if (message.purpose && message.purpose === 'check grammar'){
   responses = []

   chrome.storage.local.get(['gc_services'], function(r){
     if(r['gc_services'] == undefined) { update_alert('signed_out')}
     if(r['gc_services'].length == 0) { update_alert('no_services')}
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
   })
   return true
 };
});


function update_alert(action) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: action}, function(response) {
      true
    });
  });
}
